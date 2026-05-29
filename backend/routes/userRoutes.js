const express = require("express");
const router = express.Router();
const db = require("../config/db");

router.get("/user-by-email", (req, res) => {

  const email = req.query.email;

  db.query(
    "SELECT id,name,email FROM users WHERE email=?",
    [email],
    (err, result) => {

      if (err) {
        // console.log("DB error:", err);
        return res.status(500).json({ error: "Server error" });
      }

      if (!result || result.length === 0) {
        return res.status(404).json({ error: "User not found" });
      }

      res.json(result[0]);
    }
  );

});

// Fetch all users
router.get("/users", (req, res) => {
  db.query("SELECT id, name, email FROM users", (err, result) => {
    if (err) {
      // console.log("DB error:", err);
      return res.status(500).json({ error: "Server error" });
    }
    res.json(result);
  });
});

module.exports = router;