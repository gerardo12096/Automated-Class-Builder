//Connect to database
var mysql = require("mysql");

var con = mysql.createConnection({
  host: "us-cdbr-east-05.cleardb.net",
  user: "bdc81fc697af58",
  password: "930e24b6",
  database: "heroku_afa353ed283b3e5",
  multipleStatements: true,
});

con.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");
});

module.exports = con;
