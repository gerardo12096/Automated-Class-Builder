//Connect to database
var mysql = require("mysql");

var con = mysql.createConnection({
  host: "us-cdbr-east-05.cleardb.net",
  user: "b14065fc30e286",
  password: "68d7aec9",
  database: "heroku_6ee4a0fcdd21b51",
  multipleStatements: true,
});

con.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");
});

module.exports = con;