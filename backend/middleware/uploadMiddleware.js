const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "globetrotter/profiles",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation: [{ width: 500, height: 500, crop: "limit" }],
    public_id: (req, file) => `user-${req.user.id}-${Date.now()}`,
  },
});

const upload = multer({ storage });

module.exports = upload.single("profileImage");