import connectToDatabase from "../../../lib/mongodb";
import RegistrationRequest from "../../../../models/RegistrationRequest";
import Admin from "../../../../models/Admin";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    await connectToDatabase();

    const { name, email, message } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: "Name and email are required" });
    }

    // Check if email already exists as admin
    const existingAdmin = await Admin.findOne({ email: email.toLowerCase() });
    if (existingAdmin) {
      return res
        .status(400)
        .json({ error: "This email is already registered" });
    }

    // Check if there's already a pending request for this email
    const existingRequest = await RegistrationRequest.findOne({
      email: email.toLowerCase(),
      status: "pending",
    });

    if (existingRequest) {
      return res.status(400).json({
        error:
          "A registration request for this email is already pending approval",
      });
    }

    // Create new registration request
    const registrationRequest = await RegistrationRequest.create({
      name,
      email: email.toLowerCase(),
      message: message || "",
      status: "pending",
    });

    res.status(201).json({
      success: true,
      message:
        "Registration request submitted successfully. You will be notified when it is approved.",
      request: {
        id: registrationRequest._id,
        name: registrationRequest.name,
        email: registrationRequest.email,
        status: registrationRequest.status,
      },
    });
  } catch (error) {
    console.error("Registration request error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
