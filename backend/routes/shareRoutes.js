const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const { uploadContent, getContent } = require("../controllers/shareController");

// upload text or file
router.post("/upload", upload.single("file"), uploadContent);

// retrieve content
router.get("/content/:token", getContent);

module.exports = router;
