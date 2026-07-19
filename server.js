const express = require("express");
const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");
require("dotenv").config();
const postToInstagram = require("./utils/instagram");
const postToFacebook = require("./utils/facebook");

const cloudinary = require("./utils/cloudinary");

const app = express();

app.use(express.json());
app.use(express.static("frontend"));

const QUEUE_FILE = "quotes.json";

// Create quotes.json if it doesn't exist
if (!fs.existsSync(QUEUE_FILE)) {
  fs.writeFileSync(QUEUE_FILE, "[]");
}

// Home page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "index.html"));
});

// ==========================
// Generate Image
// ==========================
app.post("/generate", async (req, res) => {
  const { quote } = req.body;

  if (!quote || quote.trim() === "") {
    return res.status(400).send("Quote required");
  }

  fs.writeFileSync("quotes.json", JSON.stringify([quote.trim()], null, 2));

  exec("node generateImages.js", async (err, stdout, stderr) => {
    console.log("STDOUT:");
    console.log(stdout);

    console.log("STDERR:");
    console.log(stderr);
    if (err) {
      console.error(stderr);
      return res.status(500).send(stderr);
    }

    const imagePath = path.join(__dirname, "reels", "reel.png");

    try {
      console.log("Image Path:", imagePath);
      console.log("Exists:", fs.existsSync(imagePath));

      if (fs.existsSync(imagePath)) {
        console.log("Stats:", fs.statSync(imagePath));
      }

      const result = await cloudinary.uploader.upload(imagePath, {
        folder: "instagram-quotes",
      });

      console.log("UPLOAD SUCCESS");
      console.log(result);

      await postToInstagram(result.secure_url, quote);

      await postToFacebook(result.secure_url, quote);

      await cloudinary.uploader.destroy(result.public_id);

      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }

      fs.writeFileSync("quotes.json", "[]");

      return res.json({
        success: true,
        imageUrl: result.secure_url,
      });
    } catch (err) {
      console.log("========== FULL ERROR ==========");
      console.log("Message:", err.message);
      console.log("HTTP Code:", err.http_code);
      console.log("Name:", err.name);
      console.log("Stack:", err.stack);

      if (err.response) {
        console.log("Response:", err.response);
      }

      console.dir(err, { depth: null });

      return res.status(500).json({
        message: err.message,
        http_code: err.http_code,
        name: err.name,
      });
    }
  });
});

app.listen(3000, () => {
  console.log("🚀 Server running at http://localhost:3000");
});
