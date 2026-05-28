const express = require("express");
const router = express.Router();
const db = require("../config/db");

// ADD REVIEW
router.post("/reviews", (req, res) => {
  const { reviewerId, sellerId, rating, reviewText } = req.body;

  if (reviewerId === sellerId) {
    return res.status(400).json({ message: "You cannot review yourself." });
  }

  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({ message: "Rating must be between 1 and 5." });
  }

  db.query(
    "INSERT INTO reviews (reviewer_id, seller_id, rating, review_text) VALUES (?, ?, ?, ?)",
    [reviewerId, sellerId, rating, reviewText],
    (err) => {
      if (err) {
        if (err.code === "ER_DUP_ENTRY") {
          return res.status(400).json({ message: "You have already reviewed this seller." });
        }
        console.error(err);
        return res.status(500).json({ message: "Database error." });
      }
      res.json({ message: "Review submitted successfully!" });
    }
  );
});

// GET SELLER REVIEWS & AVERAGE
router.get("/reviews/:sellerId", (req, res) => {
  const sellerId = req.params.sellerId;

  const query = `
    SELECT r.*, u.name as reviewer_name 
    FROM reviews r
    JOIN users u ON r.reviewer_id = u.id
    WHERE r.seller_id = ?
    ORDER BY r.created_at DESC
  `;

  db.query(query, [sellerId], (err, reviews) => {
    if (err) {
      console.error(err);
      return res.status(500).json(err);
    }

    const averageRating = reviews.length > 0 
      ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
      : 0;

    res.json({ 
      averageRating: Number(averageRating), 
      reviews 
    });
  });
});

module.exports = router;
