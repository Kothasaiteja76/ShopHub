const Order = require("../models/Order");

exports.checkout = async (req, res) => {
  const order = await Order.create({
    userId: req.user._id,
    items: req.body.items,
    totalAmount: req.body.totalAmount,
  });

  res.status(201).json(order);
};

exports.getOrders = async (req, res) => {
  const orders = await Order.find({ userId: req.user._id });
  res.json(orders);
};