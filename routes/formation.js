const express = require("express");
const formationController = require("../controllers/formation");

const router = express.Router();

router.post("/add-formation", formationController.addFormation);

module.exports = router;
