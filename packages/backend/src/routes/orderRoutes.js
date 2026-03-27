const express = require("express");
const router = express.Router();
const { checkout, getMyOrders, getOrderById, cancelOrder } = require("../controllers/orderController");
const { protect } = require("../middlewares/auth");

router.post("/checkout", protect, checkout);
router.get("/", protect, getMyOrders);
router.get("/:id", protect, getOrderById);
router.put("/:id/cancel", protect, cancelOrder);

module.exports = router;