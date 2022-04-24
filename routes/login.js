const express = require("express");
const router = express.Router();
const loginController = require("../controllers/loginController");

//show login page
router.get("/", loginController.displayLogin);
//show registration page
router.get("/register", loginController.registration);
//registration process
router.post("/registerUser", loginController.registerUser);
//login process
router.post("/loginUser", loginController.loginUser);
//logout / session destory
router.get("/logout", loginController.logoutUser);
router.post("/adminHome", loginController.adminHome);
module.exports = router;
