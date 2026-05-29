const multer = require("multer");
const path = require("path");
const cloudinary = require("../config/cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const fs = require("fs");

// Ensure local uploads folder exists just in case
if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

let storage;

if (process.env.USE_CLOUDINARY === "true") {
  // Use Cloudinary for production
  storage = new CloudinaryStorage({
    cloudinary,
    params: {
      folder: "campus_olx",
      allowed_formats: ["jpg", "jpeg", "png", "webp"],
    },
  });
} else {
  // Use Local Storage for local development (bypasses the 2026 clock issue)
  storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname));
    }
  });
}

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Not an image! Please upload an image."), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

module.exports = upload;
