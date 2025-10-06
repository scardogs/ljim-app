export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey =
    process.env.GOOGLE_API_KEY ||
    process.env.NEXT_PUBLIC_GOOGLE_API_KEY ||
    (req.body && req.body.apiKey);
  if (!apiKey) {
    return res.status(401).json({
      error:
        "Missing API key. Provide GOOGLE_API_KEY server env or 'apiKey' in request body.",
    });
  }

  try {
    const { message, history } = req.body || {};
    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "'message' is required" });
    }

    // Build contents with optional history (as simple text turns).
    const contents = [];
    const systemPrompt =
      "You are a dual-role assistant: a tech support expert and a Bible scholar. " +
      "Always clarify which perspective your advice is coming from when answering (Tech Support or Bible Scholar). " +
      "The one who created this website or should i say the web developer is John Michael Escarlan. " +
      "Be patient, precise, and provide actionable solutions, integrating both technical expertise and biblical understanding when appropriate. " +
      "Do not reveal or mention any underlying model/provider names or API details. Focus on the user's problem only.\n\n" +
      "Ministry memory (use when relevant, and for site questions):\n" +
      "- Bishop Ed Dalisay Fernandez is the founder and spiritual leader of Lift Jesus International Ministries (LJIM). His ministry journey is marked by faith, humility, and a passion for evangelism. Under his leadership, LJIM has reached countless lives worldwide with the message of Jesus Christ. His vision inspires believers to lift up the name of Jesus above all.\n" +
      "- LJIM is a Christ-centered global fellowship committed to spreading the message of salvation through faith in Jesus Christ.\n" +
      "- Our Story: Founded to uplift communities through faith, LJIM strives to transform lives with love, compassion, and biblical teachings.\n" +
      "- Mission: Bring spiritual transformation worldwide, empower believers, and serve communities through meaningful outreach programs and initiatives.\n" +
      "- Vision: A world transformed by the Gospel, reflecting God's love, peace, and justice; equipping believers to shine as lights in every community.\n" +
      "- Core Values: Faith, community, service, evangelism.\n\n" +
      "Website overview (for UX/help questions):\n" +
      "- Pages: Home, About, Music (Lineup, Composition), Events, Contact, Give, Chat.\n" +
      "- Home aggregates sections from the site; navbar provides navigation across all pages.\n" +
      "- Music features singer/song management (lineup & composition).\n" +
      "- Give provides ways to support LJIM; Contact shares contact options; Events lists ministry events.\n" +
      "- Chat offers a support & Bible Q&A assistant.\n";
    contents.push({ role: "user", parts: [{ text: systemPrompt }] });
    if (Array.isArray(history)) {
      for (const turn of history) {
        const role = turn.role === "user" ? "user" : "model";
        const text = typeof turn.content === "string" ? turn.content : "";
        if (text) contents.push({ role, parts: [{ text }] });
      }
    }
    contents.push({ role: "user", parts: [{ text: message }] });

    const candidateModels = [
      // 1.5 family
      "gemini-1.5-flash",
      "gemini-1.5-flash-001",
      "gemini-1.5-flash-002",
      "gemini-1.5-flash-latest",
      "gemini-1.5-flash-8b",
      "gemini-1.5-flash-8b-001",
      "gemini-1.5-flash-8b-latest",
      "gemini-1.5-pro",
      "gemini-1.5-pro-001",
      "gemini-1.5-pro-002",
      "gemini-1.5-pro-latest",
      // 1.0 family
      "gemini-1.0-pro",
      "gemini-1.0-pro-001",
      "gemini-1.0-pro-latest",
    ];
    const apiVersions = ["v1", "v1beta"]; // try v1 first

    let lastError = null;
    // Helper to try generateContent for a specific version/model
    const tryGenerate = async (version, model) => {
      const url =
        "https://generativelanguage.googleapis.com/" +
        version +
        "/models/" +
        model +
        ":generateContent?key=" +
        apiKey;

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents }),
      });
      return response;
    };

    for (const version of apiVersions) {
      for (const model of candidateModels) {
        const response = await tryGenerate(version, model);

        if (!response.ok) {
          const status = response.status;
          const text = await response.text();
          console.error("Upstream API error for", version, model, status, text);
          lastError = { status, text, model, version };
          if (status !== 404) {
            // Break on non-404 errors (e.g., 401, 429, 500)
            break;
          }
          // If 404, try the next model/version
          continue;
        }

        const data = await response.json();
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
        return res.status(200).json({ reply: text });
      }
      if (lastError && lastError.status !== 404) break;
    }

    // If all known models failed (likely model naming / access), query ListModels to discover accessible IDs
    const listAndRetry = async () => {
      for (const version of apiVersions) {
        const listUrl =
          "https://generativelanguage.googleapis.com/" +
          version +
          "/models?key=" +
          apiKey;
        const listRes = await fetch(listUrl);
        if (!listRes.ok) {
          continue;
        }
        const listData = await listRes.json();
        const models = Array.isArray(listData?.models) ? listData.models : [];
        // Prefer models that support generateContent
        const supported = models
          .filter(
            (m) =>
              Array.isArray(m?.supportedGenerationMethods) &&
              m.supportedGenerationMethods.includes("generateContent")
          )
          .map((m) => m.name?.split("/").pop())
          .filter(Boolean);

        for (const model of supported) {
          const response = await tryGenerate(version, model);
          if (!response.ok) {
            const status = response.status;
            const text = await response.text();
            console.error(
              "Upstream API error for discovered",
              version,
              model,
              status,
              text
            );
            lastError = { status, text, model, version };
            if (status !== 404) break;
            continue;
          }
          const data = await response.json();
          const text = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
          return {
            ok: true,
            body: { reply: text },
          };
        }
      }
      return { ok: false };
    };

    const discovered = await listAndRetry();
    if (discovered.ok) {
      return res.status(200).json(discovered.body);
    }

    const msg = lastError
      ? `Upstream request failed for ${lastError.version}/${lastError.model} (status ${lastError.status}): ${lastError.text}`
      : "Upstream request failed (no further details)";
    return res.status(lastError?.status || 500).json({ error: msg });
  } catch (e) {
    console.error("Chat route unexpected error:", e);
    return res
      .status(500)
      .json({ error: "Unexpected error", details: e?.message || String(e) });
  }
}
