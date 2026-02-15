const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.use(require("./routes/shareRoutes"));

app.use((err, req, res, next) => {
  if (err.code === "LIMIT_FILE_SIZE")
    return res.status(400).json({ error: "File too large (max 5MB)" });

  if (err.message === "Invalid file type")
    return res.status(400).json({ error: "Unsupported file type" });

  next(err);
});

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

app.listen(process.env.PORT, () =>
  console.log("Server running on port", process.env.PORT)
);
require("./cron/cleanup");
