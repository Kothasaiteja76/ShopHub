const express = require("express");
const router = express.Router();
const { getProducts, searchProducts, getProductById, createProduct, updateProduct, deleteProduct } = require("../controllers/productController");
const { protect, adminOnly } = require("../middlewares/auth");

router.get("/", getProducts);
router.get("/search", searchProducts);
router.get("/:id", getProductById);
router.post("/", protect, adminOnly, createProduct);
router.put("/:id", protect, adminOnly, updateProduct);
router.delete("/:id", protect, adminOnly, deleteProduct);

module.exports = router;