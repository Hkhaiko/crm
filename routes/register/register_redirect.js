const express = require("express");
const router = express.Router();
const registerController = require("../../controllers/register/redirect_register");

router.get("/register-redirect", registerController.getRegisterRedirect);

module.exports = router;
