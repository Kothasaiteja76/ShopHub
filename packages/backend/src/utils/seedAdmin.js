const User = require("../models/User");

const seedAdmin = async () => {
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
};

module.exports = seedAdmin;