const axios = require("axios");
const { GOOGLE_API, MS_API } = require("../utils/constants");

const axiosMiddleware = async (options, req) => {

    const token = req.header("Authorization");
    const loginType = req.header("LoginType") || req.body.loginType;

    // console.log(token, loginType);

    const response = await axios({
        ...options,
        url: (loginType === 'google' ? GOOGLE_API : MS_API) + options.url,
        headers: {
            'Authorization': `Bearer ${token}`
        }
    }).then((res) => {
        return res.data
    }).catch((err) => {
        // console.log('err', err);
        return err
    })
    return response
}

module.exports = { axiosMiddleware }