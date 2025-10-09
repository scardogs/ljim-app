import connectToDatabase from "../../../../../lib/mongodb";
import RegistrationRequest from "../../../../../../models/RegistrationRequest";
import { verifyToken } from "../../../../../utils/auth";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

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

    const { id } = req.query;
    const { reason } = req.body;

    const request = await RegistrationRequest.findById(id);
    if (!request) {
      return res.status(404).json({ error: "Registration request not found" });
    }

    if (request.status !== "pending") {
      return res.status(400).json({
        error: "This request has already been processed",
      });
    }

    // Update request status
    request.status = "rejected";
    request.rejectionReason = reason || "No reason provided";
    await request.save();

    // TODO: Send email notification about rejection

    res.status(200).json({
      success: true,
      message: "Registration request rejected",
      request: {
        id: request._id,
        name: request.name,
        email: request.email,
        status: request.status,
      },
    });
  } catch (error) {
    console.error("Reject registration error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
