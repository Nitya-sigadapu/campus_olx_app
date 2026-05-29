const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  // console.log("HEADERS RECEIVED:", req.headers);
  

  try {

    const authHeader = req.headers.authorization;

    // Check if header exists
    if (!authHeader) {
      return res.status(401).json({ message: "Authorization header missing" });
    }

    // Format: Bearer TOKEN
    const parts = authHeader.split(" ");

    if (parts.length !== 2 || parts[0] !== "Bearer") {
      return res.status(401).json({ message: "Invalid authorization format" });
    }

    const token = parts[1];

    // Verify token
    const decoded = jwt.verify(token, "secretkey");

    // Attach user id to request
    req.userId = Number(decoded.id);

    next();

  } catch (err) {

    // console.log("Auth error:", err.message);

    return res.status(401).json({
      message: "Authentication failed"
    });

  }

};