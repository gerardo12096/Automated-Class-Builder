const express = require("express");
const router = express.Router();
const fs = require("fs");
const pdf = require("pdf-parse");
const app = express();
const http = require("http");
const path = require("path");
const upload = require("express-fileupload");
const json2xls = require("json2xls");

var mysql = require("mysql");
const { end } = require("../db_connect");
var db_connect = require("../db_connect");
var util = require("util");
const query = util.promisify(db_connect.query).bind(db_connect);

router.post("/adminHome", (req, res) => {
  req.session.StudentId = 000000000;
  req.session.save();
  (async () => {
    res.render("adminHome");
  })();
});

router.get("/download", (req, res) => {
  (async () => {
    let sql =
      "Select Distinct Department, CourseNumber, count(CourseNumber) AS Demand from PlannerCourses Group by Department,courseNumber;";
    let result = await query(sql);
    await clear();
    await convert(result);
    res.download(
      "/Users/gerardobarondiaz/Visual Studio Code/senior design/490-1/490 copy 3/public/admin.xls"
    );
  })();
});

module.exports = router;

//-------------------Other functions----------------

var convert = function (array) {
  var xls = json2xls(array);
  fs.writeFileSync(
    "/Users/gerardobarondiaz/Visual Studio Code/senior design/490-1/490 copy 3/public/admin.xls",
    xls,
    "binary",
    (err) => {
      if (err) {
        console.log("writeFileSync :", err);
      }
      console.log(filename + " file is saved!");
    }
  );
};

var clear = function () {
  fs.writeFileSync(
    "/Users/gerardobarondiaz/Visual Studio Code/senior design/490-1/490 copy 3/public/admin.xls",
    "",
    "binary",
    (err) => {
      if (err) {
        console.log("writeFileSync :", err);
      }
      console.log(filename + " file is saved!");
    }
  );
};
