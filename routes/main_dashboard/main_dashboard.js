const express = require("express");
const router = express.Router();
const mainDashboardController = require("../../controllers/main_dashboard/main_dashboard");
const authController = require("../../controllers/user/auth");

router.get(
  "/main-dashboard",
  authController.ensureAuthenticated,
  mainDashboardController.getMainDashboard
);

module.exports = router;
