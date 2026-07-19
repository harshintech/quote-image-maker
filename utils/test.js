require("dotenv").config();

const cloudinary = require("./cloudinary");

(async () => {
  try {
    const result = await cloudinary.api.ping();
    console.log(result);
  } catch (err) {
    console.error(err);
  }
})();