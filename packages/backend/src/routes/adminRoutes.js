const express = require("express");
const router = express.Router();
const { getDashboard, getAllOrders, updateOrderStatus, updateInventory, updatePrice, updateAvailability, getAllUsers, toggleUserActive } = require("../controllers/adminController");
const { protect, adminOnly } = require("../middlewares/auth");

router.get("/dashboard", protect, adminOnly, getDashboard);
router.get("/orders", protect, adminOnly, getAllOrders);
router.put("/orders/:id/status", protect, adminOnly, updateOrderStatus);
router.put("/products/:id/inventory", protect, adminOnly, updateInventory);
router.put("/products/:id/price", protect, adminOnly, updatePrice);
router.put("/products/:id/availability", protect, adminOnly, updateAvailability);
router.get("/users", protect, adminOnly, getAllUsers);
router.put("/users/:id/toggle-active", protect, adminOnly, toggleUserActive);

module.exports = router;