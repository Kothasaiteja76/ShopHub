const express = require("express");
const router = express.Router();
const { getProfile, updateProfile, changePassword, getUserOrders } = require("../controllers/userController");
const { protect } = require("../middlewares/auth");

router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);
router.put("/change-password", protect, changePassword);
router.get("/orders", protect, getUserOrders);

module.exports = router;