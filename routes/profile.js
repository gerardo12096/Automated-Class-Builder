const express = require("express");
const router = express.Router();

const profileController = require("../controllers/profileController");
//get profile
router.get("/profile", profileController.getProfile);
//get edit page
router.get("/editUser", profileController.editUser);
//edit process
router.post("/edit", profileController.editPost);

module.exports = router;
