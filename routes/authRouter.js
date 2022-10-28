const express = require("express");

const authController = require("../controllers/authController.js");

const router = express.Router();

router.get("/", authController.GetLogin);
router.post("/login", authController.PostLogin);
router.post("/logout", authController.Logout);

router.get("/register", authController.GetSignup);
router.post("/register", authController.PostSignup);

router.get("/reset", authController.GetReset);
router.post("/reset", authController.PostReset);

router.get("/reset/:token", authController.GetNewPassword);
router.get("/activate/:token", authController.GetActivate);
router.post("/new-password", authController.PostNewPassword);



module.exports = router;