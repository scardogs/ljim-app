import connectToDatabase from "../../../../../lib/mongodb";
import RegistrationRequest from "../../../../../../models/RegistrationRequest";
import { verifyToken } from "../../../../../utils/auth";
import { sendApprovalEmail } from "../../../../../utils/email";
import crypto from "crypto";

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

    const request = await RegistrationRequest.findById(id);
    if (!request) {
      return res.status(404).json({ error: "Registration request not found" });
    }

    if (request.status !== "pending") {
      return res.status(400).json({
        error: "This request has already been processed",
      });
    }

    // Generate approval token (valid for 7 days)
    const approvalToken = crypto.randomBytes(32).toString("hex");
    const approvalExpires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    // Update request status
    request.status = "approved";
    request.approvedBy = decoded.id;
    request.approvalToken = approvalToken;
    request.approvalExpires = approvalExpires;
    await request.save();

    // Generate dynamic base URL from request headers
    const protocol = req.headers["x-forwarded-proto"] || "http";
    const host =
      req.headers["x-forwarded-host"] || req.headers.host || "localhost:3000";
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || `${protocol}://${host}`;

    const approvalLink = `${baseUrl}/register/complete?token=${approvalToken}`;

    // Send email notification with approval link
    let emailSent = false;
    let emailError = null;

    try {
      await sendApprovalEmail({
        to: request.email,
        name: request.name,
        approvalLink,
      });
      emailSent = true;
      console.log(`Approval email sent to ${request.email}`);
    } catch (error) {
      emailError = error.message;
      console.error("Failed to send approval email:", error);
      // Don't fail the request if email fails - still return success
    }

    res.status(200).json({
      success: true,
      message: emailSent
        ? "Registration request approved and email sent successfully"
        : "Registration request approved (email failed to send)",
      approvalLink,
      emailSent,
      emailError: emailSent ? null : emailError,
      request: {
        id: request._id,
        name: request.name,
        email: request.email,
        status: request.status,
      },
    });
  } catch (error) {
    console.error("Approve registration error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
