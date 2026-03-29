const bcrypt = require("bcryptjs");

const seedAdmin = async () => {
  try {
    // Require inside function to avoid circular deps
    const User = require("../models/User");

    const adminExists = await User.findOne({ role: "admin" });

    if (!adminExists) {
      // Hash password manually to avoid pre-save hook issues
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash("admin123", salt);

      await User.create({
        username: "admin",
        fullName: "Admin User",
        email: "admin@ecommerce.com",
        password: hashedPassword,
        role: "admin",
        isActive: true,
      });

      console.log("✅ Default admin created: admin@ecommerce.com / admin123");
    } else {
      console.log("✅ Admin already exists");
    }
  } catch (error) {
    console.error("Seed admin error:", error.message);
  }
};

module.exports = seedAdmin;