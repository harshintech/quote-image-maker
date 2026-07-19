require("dotenv").config();

const cloudinary = require("./cloudinary");

(async () => {
  try {
    console.log("Cloud Name:", cloudinary.config().cloud_name);
    console.log("API Key:", cloudinary.config().api_key);

    const result = await cloudinary.uploader.upload(
      "https://res.cloudinary.com/demo/image/upload/sample.jpg",
      {
        resource_type: "image",
        use_filename: true,
        unique_filename: false,
        overwrite: true,
      },
    );

    console.log(result);
  } catch (err) {
    console.log("ERROR:");
    console.dir(err, { depth: null });

    if (err.error) {
      console.log("Cloudinary Error:", err.error);
    }
  }
})();
