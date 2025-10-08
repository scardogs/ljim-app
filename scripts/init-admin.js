/**
 * Script to create an initial admin user
 * Run with: node scripts/init-admin.js
 */

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const readline = require("readline");

// You'll need to set your MongoDB URI here or in environment variables
const MONGODB_URI = process.env.MONGODB_URI || "your_mongodb_uri_here";

const AdminSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true },
    role: { type: String, default: "admin" },
  },
  { timestamps: true }
);

const Admin = mongoose.models.Admin || mongoose.model("Admin", AdminSchema);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const question = (query) =>
  new Promise((resolve) => rl.question(query, resolve));

async function createAdmin() {
  try {
    console.log("🔧 Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB\n");

    console.log("📝 Create Initial Admin Account\n");

    const name = await question("Enter admin name: ");
    const email = await question("Enter admin email: ");
    const password = await question("Enter admin password: ");

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create admin
    const admin = await Admin.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
    });

    console.log("\n✅ Admin account created successfully!");
    console.log(`\nName: ${admin.name}`);
    console.log(`Email: ${admin.email}`);
    console.log(`ID: ${admin._id}`);
    console.log("\n🎉 You can now login at /login");
  } catch (error) {
    if (error.code === 11000) {
      console.error("\n❌ Error: An admin with this email already exists");
    } else {
      console.error("\n❌ Error creating admin:", error.message);
    }
  } finally {
    rl.close();
    await mongoose.connection.close();
    process.exit();
  }
}

createAdmin();
