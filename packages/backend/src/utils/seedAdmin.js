const bcrypt = require("bcryptjs");

const seedAdmin = async () => {
  try {
    const User = require("../models/User");

    const adminExists = await User.findOne({ role: "admin" });

    if (!adminExists) {
      // Directly insert without triggering pre-save hook
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash("admin123", salt);

      await User.collection.insertOne({
        username: "admin",
        fullName: "Admin User",
        email: "admin@ecommerce.com",
        password: hashedPassword,
        role: "admin",
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      console.log("✅ Admin created: admin@ecommerce.com / admin123");
    } else {
      console.log("✅ Admin already exists");
    }
  } catch (error) {
    console.error("Seed admin error:", error.message);
  }
};

module.exports = seedAdmin;