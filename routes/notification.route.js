const express = require("express");
const { notificationController } = require("../controllers");
const verify = require("../middlewares/verifyToken");

const router = express.Router();

router.post("/register", verify, notificationController.register);
router.post("/sendnotification", notificationController.sendNotifications);
router.post(
  "/sendmutationpermissionmail",
  notificationController.sendpermissionmail
);

module.exports = router;
