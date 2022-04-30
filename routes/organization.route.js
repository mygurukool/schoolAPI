const express = require("express");
const { organizationController } = require("../controllers");
const router = express.Router();

router.post("/create", organizationController.create);
router.post(
  "/changeUploadPermission",
  organizationController.changeUploadPermission
);

router.get(
  "/checkUploadPermission",
  organizationController.checkUploadPermission
);

module.exports = router;
