const express = require("express");
const router = express.Router();
const Gig = require("../models/gig");
const jwt = require("jsonwebtoken");

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

router.post("/", authenticate, async (req, res) => {
  try {
    const gig = new Gig({
      ...req.body,
      user: req.user.id,
    });
    const savedGig = await gig.save();
    res.status(201).json(savedGig);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const gigs = await Gig.find().populate("user", "username email");
    res.json(gigs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.id).populate("user", "username");
    if (!gig) return res.status(404).json({ message: "Gig not found" });
    res.json(gig);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put("/:id", authenticate, async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.id);
    if (!gig) return res.status(404).json({ message: "Gig not found" });
    if (gig.user.toString() !== req.user.id)
      return res.status(403).json({ message: "Unauthorized" });

    Object.assign(gig, req.body);
    const updatedGig = await gig.save();
    res.json(updatedGig);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete("/:id", authenticate, async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.id);
    if (!gig) return res.status(404).json({ message: "Gig not found" });
    if (gig.user.toString() !== req.user.id)
      return res.status(403).json({ message: "Unauthorized" });

    await gig.remove();
    res.json({ message: "Gig deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/user/:id", async (req, res) => {
  try {
    const gigs = await Gig.find({ user: req.params.id });
    res.json(gigs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


module.exports = router;
