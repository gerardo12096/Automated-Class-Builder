// const express = require("express");
// const router = express.Router();
// const fs = require("fs");
// const pdf = require("pdf-parse");
// const app = express();
// const http = require("http");
// const path = require("path");
// const upload = require("express-fileupload");

// var mysql = require("mysql");
// const { end } = require("../db_connect");
// var db_connect = require("../db_connect");

// //get profile
// router.get("/profile", (req, res) => {
//   //console.log(req.session.StudentId);
//   let sqll =
//     "SELECT * from student WHERE StudentId = " +
//     req.session.StudentId +
//     " limit 1;";
//   db_connect.query(sqll, (err, result) => {
//     if (err) throw err;
//     res.render("profile", { data: result });
//   });
// });

// //get edit page
// router.get("/editUser", (req, res) => {
//   res.render("editUser");
// });

// //edit process
// router.post("/edit", (req, res) => {
//   //db query
//   res.redirect("/profile");
// });

// module.exports = router;

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
