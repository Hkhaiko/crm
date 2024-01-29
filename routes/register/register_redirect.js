const express = require("express");
const router = express.Router();
const registerController = require("../../controllers/register/redirect_register");
const authController = require("../../controllers/user/auth");

router.get(
  "/register-redirect",
  authController.ensureAuthenticatedAndAdmin,
  registerController.getRegisterRedirect
);

module.exports = router;
