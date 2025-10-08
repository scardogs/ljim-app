import connectToDatabase from "../../../lib/mongodb";
import Admin from "../../../../models/Admin";
import bcrypt from "bcryptjs";
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
  } else if (req.method === "POST") {
    // Create new admin user
    try {
      const { name, email, password, role } = req.body;

      if (!name || !email || !password) {
        return res
          .status(400)
          .json({ error: "Name, email, and password are required" });
      }

      // Check if user already exists
      const existingUser = await Admin.findOne({ email: email.toLowerCase() });
      if (existingUser) {
        return res
          .status(400)
          .json({ error: "User with this email already exists" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create new user
      const newUser = await Admin.create({
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        role: role || "admin",
      });

      // Return user without password
      const userResponse = {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        createdAt: newUser.createdAt,
      };

      res.status(201).json({
        success: true,
        message: "User created successfully",
        user: userResponse,
      });
    } catch (error) {
      console.error("Error creating user:", error);
      res.status(500).json({ error: "Failed to create user" });
    }
  } else if (req.method === "PUT") {
    // Update user details
    try {
      const { userId, name, email, password, role } = req.body;

      if (!userId) {
        return res.status(400).json({ error: "User ID is required" });
      }

      const updateData = {};
      if (name) updateData.name = name;
      if (email) updateData.email = email.toLowerCase();
      if (role) updateData.role = role;

      // If password is provided, hash it
      if (password) {
        updateData.password = await bcrypt.hash(password, 10);
      }

      // Check if email is already taken by another user
      if (email) {
        const existingUser = await Admin.findOne({
          email: email.toLowerCase(),
          _id: { $ne: userId },
        });
        if (existingUser) {
          return res
            .status(400)
            .json({ error: "Email already in use by another admin" });
        }
      }

      const updatedUser = await Admin.findByIdAndUpdate(userId, updateData, {
        new: true,
        runValidators: true,
      }).select("-password");

      if (!updatedUser) {
        return res.status(404).json({ error: "User not found" });
      }

      res.status(200).json({
        success: true,
        message: "User updated successfully",
        user: updatedUser,
      });
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ error: "Failed to update user" });
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
      const deletedUser = await Admin.findByIdAndDelete(userId);

      if (!deletedUser) {
        return res.status(404).json({ error: "User not found" });
      }

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
