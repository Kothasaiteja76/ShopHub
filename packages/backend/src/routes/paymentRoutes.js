
const express = require("express");
const router = express.Router();
const { createPaymentIntent, confirmPayment, getPaymentStatus, stripeWebhook } = require("../controllers/paymentController");
const { protect } = require("../middlewares/auth");

router.post("/create-payment-intent", protect, createPaymentIntent);
router.post("/confirm", protect, confirmPayment);
router.get("/status/:orderId", protect, getPaymentStatus);
router.post("/webhook", express.raw({ type: "application/json" }), stripeWebhook);

module.exports = router;