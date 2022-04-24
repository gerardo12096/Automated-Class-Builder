const express = require("express");
const router = express.Router();

const uploadController = require("../controllers/uploadController");

//upload page
router.post("/upload", uploadController.displayUpload);

//upload process
router.post("/drpupload", uploadController.dprUpload);

//planner page
router.get("/planner", uploadController.getPlanner);

module.exports = router;
