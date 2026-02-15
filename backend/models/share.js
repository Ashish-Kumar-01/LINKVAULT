const mongoose = require("mongoose");

const shareSchema = new mongoose.Schema({
  token: { type: String, unique: true, required: true },
  type: { type: String, enum: ["text", "file"], required: true },
  textContent: String,
  fileUrl: String,
  originalFileName: String,

  oneTime: {
    type: Boolean,
    default: false
  },
  maxViews: {
  type: Number,
  default: null
  },
  viewsUsed: {
    type: Number,
    default: 0
  },

  expiresAt: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now }
});


module.exports = mongoose.models.Share || mongoose.model("Share", shareSchema);

