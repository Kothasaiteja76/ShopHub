const User = require("../models/User");

const seedAdmin = async () => {
  try {
    const adminExists = await User.findOne({ role: "admin" });
    if (!adminExists) {
      await User.create({
        username: "admin",
        fullName: "Admin User",
        email: "admin@ecommerce.com",
        password: "admin123",
        role: "admin",
      });
      console.log("Default admin created: admin@ecommerce.com / admin123");
    }
  } catch (error) {
    console.error("Seed admin error:", error.message);
  }
};

module.exports = seedAdmin;