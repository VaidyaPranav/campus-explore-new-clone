// routes/uploadRoute.js
const express = require("express");
const multer = require("multer");
const cloudinary = require("../utils/cloudinary");
const fs = require("fs");
const router = express.Router();

const upload = multer({ dest: "uploads/" }); // Store temp file

router.post("/upload", upload.single("media"), async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(req.file.path, {
      resource_type: "auto", // For image/video
    });

    fs.unlinkSync(req.file.path); // Delete temp file

    res.status(200).json({ url: result.secure_url });
  } catch (err) {
    console.error("Cloudinary upload error:", err);
    res.status(500).json({ error: "Upload failed" });
  }
});

module.exports = router;
