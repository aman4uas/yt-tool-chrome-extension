const express = require("express");
const router = express.Router();
const controllers = require("../controllers/controllers");

router.get("/result/:id", controllers.resultHandler);
router.get("/", controllers.rootHandler);

module.exports = router;
