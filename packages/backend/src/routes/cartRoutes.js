const express = require("express");
const router = express.Router();
const { addToCart, getCart } = require("../controllers/cartController");
const { protect } = require("../middleware/auth");

router.get("/", protect, getCart);
router.post("/", protect, addToCart);

module.exports = router;