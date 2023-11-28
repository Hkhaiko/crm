const express = require("express");
const companyController = require("../../controllers/company/company");

const router = express.Router();

router.get("/company-profile/:id", companyController.getCompanyUserById);

//Profile
router.post(
  "/delete-company-profile/:id", // Changment peut etre
  companyController.deleteCompanyProfile
);

//Contact
router.post("/add-company-contact/:id", companyController.createCompanyContact);
router.post(
  "/delete-company-contact/:id",
  companyController.deleteCompanyContact
);

//Project
router.post("/add-company-project/:id", companyController.createCompanyProject);
router.post("/delete-company-project", companyController.deleteCompanyProject);

//Opportunites
router.post(
  "/add-company-project/:id",
  companyController.createCompanyOpportunities
);

module.exports = router;
