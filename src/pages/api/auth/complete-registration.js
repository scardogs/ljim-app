import connectToDatabase from "../../../lib/mongodb";
import RegistrationRequest from "../../../../models/RegistrationRequest";
import Admin from "../../../../models/Admin";
import bcrypt from "bcryptjs";
import { signToken } from "../../../utils/auth";

export default async function handler(req, res) {
  try {
    await connectToDatabase();

    // GET - Verify token and get request details
    if (req.method === "GET") {
      const { token } = req.query;

      if (!token) {
        return res.status(400).json({ error: "Token is required" });
      }

      const request = await RegistrationRequest.findOne({
        approvalToken: token,
        status: "approved",
      });

      if (!request) {
        return res
          .status(404)
          .json({ error: "Invalid or expired approval link" });
      }

      // Check if token has expired
      if (request.approvalExpires < new Date()) {
        return res
          .status(400)
          .json({ error: "This approval link has expired" });
      }

      // Check if email already registered
      const existingAdmin = await Admin.findOne({ email: request.email });
      if (existingAdmin) {
        return res.status(400).json({
          error: "This email is already registered. Please login instead.",
        });
      }

      return res.status(200).json({
        valid: true,
        name: request.name,
        email: request.email,
      });
    }

    // POST - Complete registration with password
    if (req.method === "POST") {
      const { token, password } = req.body;

      if (!token || !password) {
        return res
          .status(400)
          .json({ error: "Token and password are required" });
      }

      if (password.length < 6) {
        return res.status(400).json({
          error: "Password must be at least 6 characters long",
        });
      }

      const request = await RegistrationRequest.findOne({
        approvalToken: token,
        status: "approved",
      });

      if (!request) {
        return res
          .status(404)
          .json({ error: "Invalid or expired approval link" });
      }

      // Check if token has expired
      if (request.approvalExpires < new Date()) {
        return res
          .status(400)
          .json({ error: "This approval link has expired" });
      }

      // Check if email already registered
      const existingAdmin = await Admin.findOne({ email: request.email });
      if (existingAdmin) {
        return res.status(400).json({
          error: "This email is already registered. Please login instead.",
        });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create new admin
      const admin = await Admin.create({
        name: request.name,
        email: request.email,
        password: hashedPassword,
      });

      // Invalidate the approval token
      request.approvalToken = null;
      await request.save();

      // Generate JWT token
      const jwtToken = signToken({
        id: admin._id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
      });

      return res.status(201).json({
        success: true,
        token: jwtToken,
        user: {
          id: admin._id,
          name: admin.name,
          email: admin.email,
          role: admin.role,
        },
      });
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    console.error("Complete registration error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
