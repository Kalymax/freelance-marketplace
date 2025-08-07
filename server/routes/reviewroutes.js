const express = require("express");
const router = express.Router();
const Review = require("../models/review");
const verifyToken = require("../middleware/verifytoken");

// POST: Create a review
router.post("/", verifyToken, async (req, res) => {
  const { gig, rating, comment } = req.body;

  try {
    const newReview = new Review({
      gig,
      user: req.user.id,
      rating,
      comment,
    });

    await newReview.save();
    res.status(201).json(newReview);
  } catch (err) {
    res.status(500).json({ error: "Failed to submit review." });
  }
});

// GET: Get all reviews for a gig
router.get("/:gigId", async (req, res) => {
  try {
    const reviews = await Review.find({ gig: req.params.gigId }).populate("user", "username");
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch reviews." });
  }
});

module.exports = router;
