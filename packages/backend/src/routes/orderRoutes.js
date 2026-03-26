const express = require("express");
const router = express.Router();
const { checkout, getOrders } = require("../controllers/orderController");
const { protect } = require("../middleware/auth");

router.post("/checkout", protect, checkout);
router.get("/", protect, getOrders);

module.exports = router;