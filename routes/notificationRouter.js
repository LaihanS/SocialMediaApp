const express = require("express");

const router = express.Router();

const homeController = require("../controllers/homeController.js");
const isAuth = require("../middleware/is-auth.js");

router.get("/notification",isAuth , );

router.post("/delete-notification",isAuth , );

module.exports = router;