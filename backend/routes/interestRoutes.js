const express = require("express");
const router = express.Router();
const db = require("../config/db");


// ADD INTEREST
router.post("/interests", (req, res) => {

  const { userId, listingId } = req.body;

  db.query(
    "INSERT INTO interests (user_id, listing_id) VALUES (?, ?)",
    [userId, listingId],
    (err) => {

      if (err) {
        console.log(err);
        return res.status(500).json(err);
      }

      res.json({ message: "Interest saved successfully" });

    }
  );

});


// GET USER INTERESTS
router.get("/interests/:userId", (req, res) => {

  const userId = req.params.userId;

  db.query(
    `SELECT listings.*, users.contact, users.email AS seller_name
     FROM interests
     JOIN listings ON interests.listing_id = listings.id
     JOIN users ON listings.seller_id = users.id
     WHERE interests.user_id = ?`,
    [userId],
    (err, result) => {

      if (err) {
        console.log(err);
        return res.status(500).json(err);
      }

      res.json(result);

    }
  );

});


// REMOVE INTEREST
router.delete("/interests", (req, res) => {

  const { userId, listingId } = req.body;

  db.query(
    "DELETE FROM interests WHERE user_id = ? AND listing_id = ?",
    [userId, listingId],
    (err) => {

      if (err) {
        console.log(err);
        return res.status(500).json(err);
      }

      res.json({ message: "Interest removed" });

    }
  );

});

module.exports = router;