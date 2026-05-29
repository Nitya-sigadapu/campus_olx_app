const express = require("express");
const router = express.Router();

const listingController = require("../controllers/listingController");
const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");

router.post("/create", authMiddleware, upload.single("image"), listingController.createListing);

router.get("/", listingController.getListings);

// CONTACT ROUTE FIRST
router.get("/:id/contact", authMiddleware, listingController.showContact);

router.put("/:id", authMiddleware, listingController.updateListing);

router.delete("/:id", authMiddleware, listingController.deleteListing);

module.exports = router;