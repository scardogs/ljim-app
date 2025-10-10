import fs from "fs/promises";
import path from "path";

// ========================================
// PERFORMANCE OPTIMIZATIONS
// ========================================

// 1. Cache system prompt in memory (5-minute TTL)
let cachedSystemPrompt = null;
let promptLoadTime = 0;
const PROMPT_CACHE_TTL = 5 * 60 * 1000; // 5 minutes

async function getSystemPrompt() {
  const now = Date.now();

  if (cachedSystemPrompt && now - promptLoadTime < PROMPT_CACHE_TTL) {
    return cachedSystemPrompt; // Instant!
  }

  const promptPath = path.join(process.cwd(), "public", "systemprompt.txt");
  cachedSystemPrompt = await fs.readFile(promptPath, "utf-8");
  promptLoadTime = now;

  return cachedSystemPrompt;
}

// 2. Optimized model list (fastest first)
const FAST_MODELS = [
  "gemini-1.5-flash-8b-latest", // Fastest
  "gemini-1.5-flash-latest",
  "gemini-1.5-flash",
];

// 3. Limit history for faster processing
const MAX_HISTORY = 10;

// 4. Request timeout
const TIMEOUT_MS = 15000; // 15 seconds

// ========================================
// MAIN HANDLER
// ========================================

export default async function handler(req, res) {
  const startTime = Date.now();

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey =
    process.env.GOOGLE_API_KEY ||
    process.env.NEXT_PUBLIC_GOOGLE_API_KEY ||
    req.body?.apiKey;

  if (!apiKey) {
    return res.status(401).json({
      error: "Missing API key. Configure GOOGLE_API_KEY environment variable.",
    });
  }

  try {
    const { message, history } = req.body || {};

    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "'message' is required" });
    }

    // Load cached system prompt
    const systemPrompt = await getSystemPrompt();

    // Build contents with limited history
    const contents = [];
    contents.push({ role: "user", parts: [{ text: systemPrompt }] });

    if (Array.isArray(history) && history.length > 0) {
      const recentHistory = history.slice(-MAX_HISTORY);
      for (const turn of recentHistory) {
        const role = turn.role === "user" ? "user" : "model";
        const text = typeof turn.content === "string" ? turn.content : "";
        if (text.trim()) {
          contents.push({ role, parts: [{ text }] });
        }
      }
    }

    contents.push({ role: "user", parts: [{ text: message }] });

    // Try fast models first
    let lastError = null;

    for (const model of FAST_MODELS) {
      try {
        const result = await callWithTimeout(apiKey, model, contents);

        if (result.success) {
          const duration = Date.now() - startTime;
          console.log(`✅ Response in ${duration}ms using ${model}`);
          return res.status(200).json({ reply: result.text });
        }

        lastError = result.error;

        if (result.status !== 404) break; // Don't try other models if not 404
      } catch (error) {
        lastError = error;
      }
    }

    // All fast models failed
    throw lastError || new Error("Failed to generate response");
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`❌ Chat error after ${duration}ms:`, error.message);

    return res.status(500).json({
      error: error.message || "Failed to generate response",
    });
  }
}

// ========================================
// HELPER FUNCTIONS
// ========================================

async function callWithTimeout(apiKey, model, contents) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents,
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        },
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      return {
        success: false,
        status: response.status,
        error: new Error(`API error: ${response.status}`),
      };
    }

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    if (!text) {
      return {
        success: false,
        error: new Error("Empty response"),
      };
    }

    return { success: true, text };
  } catch (error) {
    clearTimeout(timeoutId);

    if (error.name === "AbortError") {
      return {
        success: false,
        status: 408,
        error: new Error("Request timeout"),
      };
    }

    return {
      success: false,
      error,
    };
  }
}
