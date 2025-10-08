import connectToDatabase from "../../../lib/mongodb";
import Admin from "../../../../models/Admin";
import { authMiddleware } from "../../../utils/auth";

async function handler(req, res) {
  await connectToDatabase();

  if (req.method === "GET") {
    try {
      // Get all admin users (exclude password field)
      const users = await Admin.find({})
        .select("-password")
        .sort({ createdAt: -1 });

      res.status(200).json({
        success: true,
        users,
        count: users.length,
      });
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ error: "Failed to fetch users" });
    }
  } else if (req.method === "DELETE") {
    try {
      const { userId } = req.body;

      if (!userId) {
        return res.status(400).json({ error: "User ID is required" });
      }

      // Prevent deleting yourself
      if (req.user.id === userId) {
        return res
          .status(400)
          .json({ error: "You cannot delete your own account" });
      }

      // Delete the user
      await Admin.findByIdAndDelete(userId);

      res.status(200).json({
        success: true,
        message: "User deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({ error: "Failed to delete user" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}

// Protect this endpoint with authentication
export default authMiddleware(handler);
