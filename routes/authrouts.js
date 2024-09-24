

const express = require('express');
const authController = require('../controllers/usercontrollers/authcontrollers');
const homepage = require("../controllers/usercontrollers/homepagecontroller");
const authe= require('../middleware/autherization');
const router = express.Router();

// GET requests
router.get("/", homepage.homepage);
router.get("/signup",  authController.renderSignup);
router.get("/login", authController.renderLogin);
router.get("/logout",authController.logout);

// POST requests
router.post("/login", authController.login);
router.post("/signup", authController.signup);

module.exports = router;
