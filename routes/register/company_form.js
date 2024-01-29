const express = require("express");
const router = express.Router();
const companyFormController = require("../../controllers/register/company_form");
const authController = require("../../controllers/user/auth");

router.get(
  "/register-redirect/company",
  authController.ensureAuthenticatedAndAdmin,
  companyFormController.getCompanyForm
);

router.post("/add-company", companyFormController.addCompany);

module.exports = router;
