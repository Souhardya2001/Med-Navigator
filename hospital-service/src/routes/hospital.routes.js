const router = require("express").Router();
const { validateNearbySearch } = require("../validators/hospital.validator");
const hospitalController = require("../controllers/hospital.controller");

router.get("/nearby", validateNearbySearch, hospitalController.nearby);

module.exports = router;
