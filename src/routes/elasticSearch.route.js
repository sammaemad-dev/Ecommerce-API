const express = require("express");
const validate = require("../middlewares/validate.middleware");
const elasticController = require("../controllers/elasticSearch.controller");
const { searchValidation } = require("../validation/elasticSearch.validation");

const router = express.Router();

router.get("/", validate(searchValidation), elasticController.searchProducts);

module.exports = router;
