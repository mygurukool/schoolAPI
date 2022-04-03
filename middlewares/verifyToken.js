const jwt = require("jsonwebtoken");
const { User } = require("../models");

async function auth(req, res, next) {
  const tokens = req.header("authorization");
  const userId = req.header("userId");

  const user = await User.findById(userId);
  if (!user) {
    return res.status(400).send({ message: "Invalid Token" });
  } else {
    req.userId = userId;
    req.role = user.role;

    req.tokens = tokens;
    req.loginTypes = user.loginTypes;
    next();
  }
}
module.exports = auth;

// const jwt = require("jsonwebtoken");
// const { User } = require("../models");

// async function auth(req, res, next) {
//   const tokens = req.header("authorization");
//   const userId = req.header("userId");

//   if (!tokens) return res.status(401).send({ message: "Access denied" });

//   try {
//     if (loginType === "mygurukool") {
//       const verified = jwt.verify(token, process.env.JWT_SECRET);
//       if (!verified) {
//         return res.status(401).send({ message: "Access denied" });
//       }
//       const userId = verified._id;

//       const users = await User.findOne({ _id: userId });
//       if (!users) {
//         return res.status(404).send({ message: "user not found" });
//       }
//       (req.organizationId = users.organizationId), (req.userId = verified._id);
//     }
//     if (loginType === "google") {
//       const users = await User.findOne({
//         "loginTypes.userId": userId,
//       });

//       console.log("google case", userId, users);

//       if (!users) {
//         return res.status(404).send({ message: "user not found" });
//       }
//       // req.organizationId = users.organizationId,
//       req.userId = userId;
//     }
//     (req.loginType = loginType), next();
//   } catch (error) {
//     res.status(400).send({ message: "Invalid Token" });
//   }
// }
// module.exports = auth;
