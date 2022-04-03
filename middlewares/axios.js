const axios = require("axios");
const { GOOGLE_API, MS_API } = require("../utils/constants");
const { findGoogleToken } = require("../utils/functions");

const axiosMiddleware = async (options, req) => {
  const tokens = req.header("authorization");
  console.log("tokens", tokens);

  const googleToken = await findGoogleToken({ tokens: JSON.parse(tokens) });
  console.log("googleToken", googleToken);

  if (googleToken) {
    const response = await axios({
      ...options,
      url: GOOGLE_API + options.url,
      headers: {
        Authorization: `Bearer ${googleToken}`,
      },
    })
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        // console.log('err', err);
        return err;
      });
    return response;
  } else {
    return new Error("No token found");
  }
  // console.log(token, loginType);
};

module.exports = { axiosMiddleware };
