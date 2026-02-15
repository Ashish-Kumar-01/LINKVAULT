const Share = require("../models/Share");
const { v4: uuidv4 } = require("uuid");

// Upload content
exports.uploadContent = async (req, res) => {
  try {
    const token = uuidv4();

    let expiresAt;

    // if exact datetime provided
    if (req.body.expiresAt) {
      expiresAt = new Date(req.body.expiresAt);
    }
    // fallback to minutes (old behavior)
    else if (req.body.expiryMinutes) {
      expiresAt = new Date(Date.now() + req.body.expiryMinutes * 60 * 1000);
    }
    // default
    else {
      expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    }


    let newShare = {
      token,
      expiresAt,
      oneTime: req.body.oneTime === "true",
      maxViews: req.body.maxViews ? Number(req.body.maxViews) : null
    };

    if (req.file) {
      newShare.type = "file";
      newShare.fileUrl = req.file.path;
      newShare.originalFileName = req.file.originalname;
    } 
    else if (req.body.text) {
      newShare.type = "text";
      newShare.textContent = req.body.text;
    } 
    else {
      return res.status(400).json({ error: "No content provided" });
    }

    await Share.create(newShare);

    res.json({
      link: `http://localhost:5173/view/${token}`
    });

  } catch (err) {
    res.status(500).json({ error: "Upload failed" });
  }
};


// Retrieve content
exports.getContent = async (req, res) => {
  try {
    const share = await Share.findOne({ token: req.params.token });

    if (!share)
      return res.status(403).json({ error: "Invalid link" });

    if (new Date() > share.expiresAt)
      return res.status(410).json({ error: "Link expired" });

    // block if limit exceeded
    if (share.maxViews !== null && share.viewsUsed >= share.maxViews)
      return res.status(410).json({ error: "View limit exceeded" });

    // always count views
    share.viewsUsed += 1;
    await share.save();


    // one-time link
    if (share.oneTime) {
      const data = { ...share._doc };
      await Share.deleteOne({ _id: share._id });
      return res.json(data);
    }

    res.json({
      token: share.token,
      type: share.type,
      textContent: share.textContent,
      fileUrl: share.fileUrl,
      originalFileName: share.originalFileName,
      createdAt: share.createdAt,
      expiresAt: share.expiresAt,
      viewsUsed: share.viewsUsed,
      maxViews: share.maxViews,
      oneTime: share.oneTime
    });

  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};
