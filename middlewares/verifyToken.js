const jwt = require("jsonwebtoken");
const { User } = require("../models");

async function auth(req, res, next) {
  const token = req.header("Authorization");
  const loginType = req.header("LoginType")
  if (!token) return res.status(401).send({ message: "Access denied" });

  try {
    if (loginType === 'mygurukool') {
      const verified = jwt.verify(token, process.env.JWT_SECRET);
      if (!verified) {
        return res.status(401).send({ message: "Access denied" });
      }
      const userId = verified._id;

      const users = await User.findOne({ _id: userId });
      if (!users) {
        return res.status(404).send({ message: "user not found" });
      }
      req.organizationId = users.organizationId,
        req.userId = verified._id;
    }
    req.loginType = loginType,

      next();
  } catch (error) {
    res.status(400).send({ message: "Invalid Token" });
  }
}
module.exports = auth;
