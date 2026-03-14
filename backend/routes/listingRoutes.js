const express = require("express");
const router = express.Router();

const listingController = require("../controllers/listingController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/create", authMiddleware, listingController.createListing);

router.get("/", listingController.getListings);

// CONTACT ROUTE FIRST
router.get("/:id/contact", listingController.showContact);

router.put("/:id", authMiddleware, listingController.updateListing);

router.delete("/:id", authMiddleware, listingController.deleteListing);

module.exports = router;