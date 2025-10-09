import connectToDatabase from "../../../lib/mongodb";
import RegistrationRequest from "../../../../models/RegistrationRequest";
import { verifyToken } from "../../../utils/auth";
import crypto from "crypto";

export default async function handler(req, res) {
  try {
    await connectToDatabase();

    // Verify admin authentication
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({ error: "Invalid token" });
    }

    // GET - Fetch all registration requests
    if (req.method === "GET") {
      const { status } = req.query;

      const filter = {};
      if (status && status !== "all") {
        filter.status = status;
      }

      const requests = await RegistrationRequest.find(filter)
        .sort({ createdAt: -1 })
        .populate("approvedBy", "name email");

      return res.status(200).json({ requests });
    }

    // DELETE - Delete a registration request
    if (req.method === "DELETE") {
      const { id } = req.body;

      if (!id) {
        return res.status(400).json({ error: "Request ID is required" });
      }

      await RegistrationRequest.findByIdAndDelete(id);

      return res.status(200).json({
        success: true,
        message: "Registration request deleted successfully",
      });
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    console.error("Registration requests error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
