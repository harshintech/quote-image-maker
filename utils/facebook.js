const axios = require("axios");

async function postToFacebook(imageUrl, caption) {
  const pageId = process.env.FACEBOOK_PAGE_ID;
  const token = process.env.FACEBOOK_PAGE_ACCESS_TOKEN;

  const result = await axios.post(
    `https://graph.facebook.com/v23.0/${pageId}/photos`,
    null,
    {
      params: {
        url: imageUrl,
        caption,
        access_token: token,
      },
    }
  );

  return result.data;
}

module.exports = postToFacebook;