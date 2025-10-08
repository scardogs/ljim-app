import jwt from "jsonwebtoken";

const JWT_SECRET =
  process.env.JWT_SECRET || "your-secret-key-change-this-in-production";

export function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

export function authMiddleware(handler) {
  return async (req, res) => {
    try {
      const token =
        req.headers.authorization?.replace("Bearer ", "") || req.cookies?.token;

      if (!token) {
        return res.status(401).json({ error: "No token provided" });
      }

      const decoded = verifyToken(token);
      if (!decoded) {
        return res.status(401).json({ error: "Invalid or expired token" });
      }

      req.user = decoded;
      return handler(req, res);
    } catch (error) {
      return res.status(401).json({ error: "Authentication failed" });
    }
  };
}
