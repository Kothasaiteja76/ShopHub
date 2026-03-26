const Cart = require("../models/Cart");

exports.getCart = async (req, res) => {
  const cart = await Cart.findOne({ userId: req.user._id });
  res.json(cart);
};

exports.addToCart = async (req, res) => {
  const cart = await Cart.findOne({ userId: req.user._id });

  cart.items.push(req.body);
  await cart.save();

  res.json(cart);
}; 