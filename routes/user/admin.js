const express = require("express");
const adminController = require("../../controllers/user/admin");
const authController = require("../../controllers/user/auth");

const router = express.Router();

router.get(
  "/admin",
  authController.ensureAuthenticatedAndAdmin,
  adminController.getAdmin
);
router.post("/update-admin-role", adminController.updateAdminRole);
router.post("/send-email", adminController.emailSender);

module.exports = router;
