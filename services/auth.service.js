const httpStatus = require("http-status");
const { User, Organization } = require("../models");
const jwt = require("jsonwebtoken");
const { default: axios } = require("axios");
const platforms = require("../utils/platforms");
const login = async (req) => {
  try {
    const data = req.body;
    const findUser = await User.findOne({ email: data.email });
    // console.log("data", data);

    if (data.loginType === "google") {
      // console.log("login if", data.loginType);
      if (!findUser) {
        const newuser = await User.create({
          ...data,
          loginTypes: [
            { userId: data.googleId, platformName: platforms.GOOGLE },
          ],
          tokens: [{ token: data.token, platformName: platforms.GOOGLE }],
        });

        return {
          status: httpStatus.OK,
          user: newuser,
          token: data.token,

          message: "Login Successs",
        };
      } else {
        console.log("login else", data.loginType);

        const existingTokens = findUser.tokens.filter(
          (p) => p.platformName !== platforms.GOOGLE
        );
        const filterLoginTypes = findUser.loginTypes.filter(
          (p) => p.platformName !== platforms.GOOGLE
        );
        const updatedUser = await User.findByIdAndUpdate(findUser._id, {
          loginTypes: [
            ...filterLoginTypes,
            { userId: data.googleId, platformName: platforms.GOOGLE },
          ],
          tokens: [
            ...existingTokens,
            {
              token: data.token,
              platformName: platforms.GOOGLE,
            },
          ],
        });
        console.log('updatedUser',updatedUser)
        return {
          status: httpStatus.OK,
          user: updatedUser,

          message: "Login Success",
        };
      }
    } else {
      if (!findUser) {
        return {
          status: httpStatus.INTERNAL_SERVER_ERROR,
          message: "Invalid email or password",
        };
      } else {
        const token = jwt.sign({ _id: findUser._id }, process.env.JWT_SECRET);

        const existingTokens = findUser.tokens.filter(
          (p) => p.platformName !== platforms.MOUGLI
        );
        const updatedUser = await User.findByIdAndUpdate(findUser._id, {
          tokens: [
            ...existingTokens,
            {
              token: token,
              platformName: platforms.MOUGLI,
            },
          ],
        });
        return {
          status: httpStatus.OK,
          user: updatedUser,

          message: "Login Success",
        };
      }
    }
  } catch (error) {
    console.log(error);
    return { status: httpStatus.INTERNAL_SERVER_ERROR, message: error };
  }
};

const details = async (req) => {
  try {
    const tokens = req.header("authorization");
    const userId = req.header("userId");
    const user = await User.findOne({
      "loginTypes.userId": userId,
    });

    // console.log("tokens", req.headers, tokens);
    if (!user) {
      return {
        status: httpStatus.NOT_FOUND,
        message: "User not found",
      };
    } else {
      return {
        status: httpStatus.OK,
        user: user,

        message: "Login Success",
      };
    }
    // const loginTypes = req.header("LoginTypes");
    // console.log("details", userId);

    // if (loginType === "google") {
    //   const user = await axios({
    //     url: "https://www.googleapis.com/userinfo/v2/me",
    //     headers: {
    //       Authorization: `Bearer ${token}`,
    //     },
    //   });
    //   const ourUser = await User.findOne({ googleId: user.data.googleId });
    //   return {
    //     status: httpStatus.OK,
    //     user: { ...user.data, imageUrl: user.data.picture },
    //     loginType: "google",
    //     message: "User details found successfully",
    //   };
    // } else {
    //   const verified = jwt.verify(token, process.env.JWT_SECRET);
    //   if (!verified) {
    //     return res.status(401).send({ message: "Access denied" });
    //   }
    //   const userId = verified._id;
    //   const user = await User.findOne({ _id: userId });
    //   const organization = await Organization.findById(user.organizationId);

    //   if (!user) {
    //     return { status: httpStatus.NOT_FOUND, message: "user does not exist" };
    //   }
    //   return {
    //     status: httpStatus.OK,
    //     user: user,
    //     loginType: "mygurukool",
    //     organization: organization,
    //     message: "User details found successfully",
    //   };
    // }
  } catch (error) {
    console.log(error);
    return {
      status: httpStatus.INTERNAL_SERVER_ERROR,
      message: "Failed to get details",
    };
  }
};

module.exports = {
  login,
  details,
};
