const express = require("express");
const router = express.Router();
const {semanticSearchProducts} = require("../controllers/search.controller");

router.get("/search",semanticSearchProducts);

module.exports = router;