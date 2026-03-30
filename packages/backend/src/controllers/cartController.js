const Cart = require("../models/Cart");
const Product = require("../models/Product");

const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user.id })
      .populate("items.product", "name image price isAvailable stock category");
    if (!cart) {
      cart = await Cart.create({ user: req.user.id, items: [], totalAmount: 0 });
    }
    res.json({ success: true, cart });
  } catch (error) {
    console.error("getCart error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      return res.status(400).json({ success: false, message: "Product ID is required" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }
    if (!product.isAvailable) {
      return res.status(400).json({ success: false, message: "Product is not available" });
    }
    if (product.stock < quantity) {
      return res.status(400).json({ success: false, message: "Insufficient stock" });
    }

    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      cart = await Cart.create({ user: req.user.id, items: [], totalAmount: 0 });
    }

    const itemIndex = cart.items.findIndex(
      (i) => i.product.toString() === productId.toString()
    );

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += Number(quantity);
    } else {
      cart.items.push({
        product: productId,
        quantity: Number(quantity),
        price: product.price,
      });
    }

    // Recalculate total
    cart.totalAmount = cart.items.reduce(
      (sum, item) => sum + item.price * item.quantity, 0
    );

    await cart.save();

    const updatedCart = await Cart.findOne({ user: req.user.id })
      .populate("items.product", "name image price isAvailable stock category");

    res.json({ success: true, cart: updatedCart });
  } catch (error) {
    console.error("addToCart error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body;
    const { productId } = req.params;

    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return res.status(404).json({ success: false, message: "Cart not found" });
    }

    const itemIndex = cart.items.findIndex(
      (i) => i.product.toString() === productId.toString()
    );

    if (itemIndex === -1) {
      return res.status(404).json({ success: false, message: "Item not in cart" });
    }

    if (quantity <= 0) {
      cart.items.splice(itemIndex, 1);
    } else {
      cart.items[itemIndex].quantity = Number(quantity);
    }

    cart.totalAmount = cart.items.reduce(
      (sum, item) => sum + item.price * item.quantity, 0
    );

    await cart.save();

    const updatedCart = await Cart.findOne({ user: req.user.id })
      .populate("items.product", "name image price isAvailable stock category");

    res.json({ success: true, cart: updatedCart });
  } catch (error) {
    console.error("updateCartItem error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;

    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return res.status(404).json({ success: false, message: "Cart not found" });
    }

    cart.items = cart.items.filter(
      (i) => i.product.toString() !== productId.toString()
    );

    cart.totalAmount = cart.items.reduce(
      (sum, item) => sum + item.price * item.quantity, 0
    );

    await cart.save();

    const updatedCart = await Cart.findOne({ user: req.user.id })
      .populate("items.product", "name image price isAvailable stock category");

    res.json({ success: true, cart: updatedCart });
  } catch (error) {
    console.error("removeFromCart error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return res.status(404).json({ success: false, message: "Cart not found" });
    }
    cart.items = [];
    cart.totalAmount = 0;
    await cart.save();
    res.json({ success: true, message: "Cart cleared", cart });
  } catch (error) {
    console.error("clearCart error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getCart, addToCart, updateCartItem, removeFromCart, clearCart };