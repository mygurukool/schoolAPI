const httpStatus = require("http-status");
const { Token } = require("../models");


const admin = require("firebase-admin");

// firebase configuration

const serviceAccount = require("../firebase.json");
const config = require("../config/config");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: config.mongoose.url
});


const register = async (req) => {
  try {
    const checkExist = await Token.find({ token: req.body.token })
    console.log('checkExist', checkExist);
    if (checkExist.length > 0) {
      return { status: httpStatus.OK };
    }
    await Token.create({ ...req.body, userId: req.userId })
    return { status: httpStatus.OK, message: 'Token registered successfully' };
  } catch (error) {
    console.log(error);
    return { status: httpStatus.INTERNAL_SERVER_ERROR, message: error };
  }
};

const sendNotifications = async (data) => {
  try {
    const { title, body, } = data
    let tokens = []
    // console.log('data', data);
    await Promise.all(data.users.map(async u => {
      const alltokens = await Token.findOne({ userId: u })
      console.log('alltokens', alltokens);
      if (alltokens) {
        tokens.push(alltokens.token)
      }
    }))

    const send = await admin.messaging().sendMulticast({
      tokens,
      notification: {
        title,
        body,
      },
      data: data.data
    });
    console.log('send', send);
    if (send.responses[0].success) {
      return ({ status: httpStatus.OK, message: 'Notification sent successfully' });
    } else {
      return ({ status: httpStatus.INTERNAL_SERVER_ERROR, message: send.responses[0].error || "Failed to send notification" });
    }
  } catch (error) {
    console.log(error);
    return ({ status: httpStatus.INTERNAL_SERVER_ERROR, message: "Failed to send notification" });

  }

}

module.exports = {
  register, sendNotifications
};
