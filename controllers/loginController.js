var mysql = require("mysql");
const bodyparser = require("body-parser");
const { redirect } = require("express/lib/response");
const { end } = require("../db_connect");
var db_connect = require("../db_connect");

const displayLogin = (req, res) => {
  res.render("login");
};

const registration = (req, res) => {
  res.render("register");
};

const registerUser = (req, res) => {
  var name = req.body.name;
  var csunid = req.body.id;
  var email = req.body.email;
  var username = req.body.username;
  var password = req.body.password;
  var repassword = req.body.repassword;
  if (password != repassword) {
    res.render("register", { error: "Passwords do not match" });
  }

  var reg =
    "INSERT INTO `student` (StudentId, Name, Email, Username, Password) VALUES ('" +
    csunid +
    "', '" +
    name +
    "', '" +
    email +
    "', '" +
    username +
    "', '" +
    password +
    "')";
  db_connect.query(reg, (err, result) => {
    if (err) throw err;
    res.redirect("/");
  });
};

const loginUser = (req, res) => {
  var username = req.body.username;
  var password = req.body.password;

  if (username == "admin" && password == "admin") {
    res.redirect(307, "/adminHome");
    exit();
  } else {
    if (username && password) {
      let sql =
        "SELECT * FROM student WHERE Username = '" +
        username +
        "' AND Password = '" +
        password +
        "';";
      db_connect.query(sql, (err, result) => {
        if (result) {
          req.session.StudentId = result[0].StudentId;
          req.session.save();
          if (result[0].dprParsed == 0) {
            res.redirect(307, "/upload");
          } else {
            res.redirect("/planner");
          }
        } else {
          console.log(err);
          res.redirect("/");
        }
      });
    }
  }
};

const logoutUser = (req, res) => {
  console.log("session destroyed");
  req.session.destroy();
  res.redirect("/");
};

const adminHome = (req, res) => {
  req.session.StudentId = 000000000;
  req.session.save();
  res.render("adminHome");
};

module.exports = {
  displayLogin,
  registration,
  registerUser,
  loginUser,
  logoutUser,
  adminHome,
};
