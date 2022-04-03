const express = require("express");
const router = express.Router();
const fs = require("fs");
const pdf = require("pdf-parse");
const app = express();
const http = require("http");
const path = require("path");
const upload = require("express-fileupload");
const profileController = require("../controllers/profileController");

var mysql = require("mysql");
const { end } = require("../db_connect");
var db_connect = require("../db_connect");

const getProfile = (req, res) => {
  console.log(req.session.StudentId);
  let sqll =
    "SELECT * from student WHERE StudentId = " +
    req.session.StudentId +
    " limit 1;";
  db_connect.query(sqll, (err, result) => {
    if (err) throw err;
    res.render("profile", { data: result });
  });
};

const editUser = (req, res) => {
  res.render("editUser");
};

const editPost = (req, res) => {
  res.redirect("/profile");
};

module.exports = {
  getProfile,
  editUser,
  editPost,
};
