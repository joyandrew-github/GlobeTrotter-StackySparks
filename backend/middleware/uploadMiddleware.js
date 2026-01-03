// src/middleware/upload.js

const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

// Shared Cloudinary storage config
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: (req, file) => {
      // Dynamic folder based on usage
      if (file.fieldname === "profileImage") return "globetrotter/profiles";
      if (file.fieldname === "coverImage") return "globetrotter/trips/covers";
      return "globetrotter/misc";
    },
    allowed_formats: ["jpg", "jpeg", "png", "webp", "gif"],
    transformation: [{ width: 1200, height: 800, crop: "limit" }],
    public_id: (req, file) => {
      const prefix = file.fieldname === "profileImage" ? "profile" : "cover";
      return `${prefix}-${req.user.id}-${Date.now()}`;
    },
  },
});

// Global multer instance (no .single() here yet)
const multerUpload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

// Export different upload handlers
module.exports = {
  uploadProfileImage: multerUpload.single("profileImage"),
  uploadCoverImage: multerUpload.single("coverImage"),
  // You can add more later: uploadActivityPhoto: multerUpload.single("photo"), etc.
};