const express = require("express");
const companyExperienceController = require("../../controllers/training/company_experience");

const router = express.Router();

router.post(
  "/add-company-experience",
  companyExperienceController.addCompanyExperience
);
router.post(
  "/delete-company-experience",
  companyExperienceController.deleteCompanyExperience
);

module.exports = router;
