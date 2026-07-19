const axios = require("axios");

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function postToInstagram(imageUrl, caption) {
  const token = process.env.FACEBOOK_PAGE_ACCESS_TOKEN;
  const igId = process.env.INSTAGRAM_BUSINESS_ID;

  const media = await axios.post(
    `https://graph.facebook.com/v23.0/${igId}/media`,
    null,
    {
      params: {
        image_url: imageUrl,
        caption,
        access_token: token,
      },
    }
  );

  const creationId = media.data.id;

  // Wait for Instagram to finish processing
  await sleep(5000); // 10 seconds

  const publish = await axios.post(
    `https://graph.facebook.com/v23.0/${igId}/media_publish`,
    null,
    {
      params: {
        creation_id: creationId,
        access_token: token,
      },
    }
  );

  return publish.data;
}

module.exports = postToInstagram;