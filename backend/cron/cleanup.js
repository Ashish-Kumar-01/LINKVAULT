const cron = require("node-cron");
const Share = require("../models/Share");
const fs = require("fs");
const path = require("path");

// runs every minute
cron.schedule("* * * * *", async () => {
  console.log("Running cleanup job...");

  try {
    const expired = await Share.find({
      expiresAt: { $lt: new Date() }
    });

    for (let item of expired) {
      // delete file if exists
      if (item.type === "file" && item.fileUrl) {
        const filePath = path.join(__dirname, "..", item.fileUrl);

        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
          console.log("Deleted file:", filePath);
        }
      }

      await Share.deleteOne({ _id: item._id });
      console.log("Deleted expired record:", item.token);
    }
  } catch (err) {
    console.log("Cleanup error:", err);
  }
});
