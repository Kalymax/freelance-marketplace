const express = require("express");
const router = express.Router();
const Order = require("../models/order");
const Gig = require("../models/gig");
const jwt = require("jsonwebtoken");

// Middleware to authenticate
const authenticate = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Access denied" });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid token" });
    req.user = user;
    next();
  });
};

// 🟢 Place an order
router.post("/", authenticate, async (req, res) => {
  try {
    const { gigId } = req.body;

    const gig = await Gig.findById(gigId);
    if (!gig) return res.status(404).json({ message: "Gig not found" });

    const order = new Order({
      gig: gig._id,
      buyer: req.user.id,
      freelancer: gig.user,
      price: gig.price,
    });

    const saved = await order.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 🔵 Get my orders (as buyer or freelancer)
router.get("/", authenticate, async (req, res) => {
  try {
    const orders = await Order.find({
      $or: [
        { buyer: req.user.id },
        { freelancer: req.user.id }
      ]
    }).populate("gig").populate("buyer", "username").populate("freelancer", "username");

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 🟡 Update order status (freelancer only)
router.put("/:id/status", authenticate, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (order.freelancer.toString() !== req.user.id)
      return res.status(403).json({ message: "Unauthorized" });

    order.status = req.body.status;
    await order.save();
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 🔹 Get orders placed by this user (as buyer only)
router.get("/user/:id", authenticate, async (req, res) => {
  try {
    if (req.user.id !== req.params.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const userOrders = await Order.find({ buyer: req.params.id })
      .populate("gig")
      .populate("freelancer", "username");

    res.json(userOrders);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch user orders" });
  }
});

module.exports = router;
