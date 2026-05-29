const express = require("express");
const router = express.Router();
const db = require("../config/db");

router.get("/messages/:user1/:user2", (req, res) => {

  const { user1, user2 } = req.params;

  const sql = `
    SELECT * FROM messages
    WHERE (sender_id=? AND receiver_id=?)
    OR (sender_id=? AND receiver_id=?)
    ORDER BY created_at
  `;

  db.query(sql, [user1, user2, user2, user1], (err, result) => {

    if (err) {
      // console.log(err);
      return res.status(500).json({ error: "DB error" });
    }

    res.json(result);

  });

});

// GET RECENT MESSAGES PREVIEW
router.get("/messages/recent/:userId", (req, res) => {
  const userId = req.params.userId;

  // We want the most recent message between this user and anyone else
  // To do this simply, we fetch all messages where this user is sender or receiver, order by time DESC
  const query = `
    SELECT m1.*
    FROM messages m1
    LEFT JOIN messages m2
    ON (
        (m1.sender_id = m2.sender_id AND m1.receiver_id = m2.receiver_id) OR
        (m1.sender_id = m2.receiver_id AND m1.receiver_id = m2.sender_id)
       )
    AND m1.time < m2.time
    WHERE m2.id IS NULL
    AND (m1.sender_id = ? OR m1.receiver_id = ?)
    ORDER BY m1.time DESC
  `;

  db.query(query, [userId, userId], (err, results) => {
    if (err) {
      // console.log(err);
      return res.status(500).json(err);
    }
    
    // Group by contact ID
    const recentMessages = {};
    results.forEach(msg => {
      const contactId = msg.sender_id == userId ? msg.receiver_id : msg.sender_id;
      recentMessages[contactId] = msg;
    });

    res.json(recentMessages);
  });
});

module.exports = router;