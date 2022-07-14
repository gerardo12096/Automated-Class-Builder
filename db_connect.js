//Connect to database
var mysql = require("mysql");

/*var con =  mysql.createPool({
  host: "m7az7525jg6ygibs.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
  user: "l0zzm1bhnzzpc78i",
  password: "qdl01dh6l25amahr",
  database: "r92ddk0uum0olfux",
  multipleStatements: true,
});*/

var con = mysql.createPool({
  host: "",
  user: "",
  password: "",
  database: "",
  multipleStatements: true,
});

/*var con =  mysql.createPool({
  host: "us-cdbr-east-05.cleardb.net",
  user: "b14065fc30e286",
  password: "68d7aec9",
  database: "heroku_6ee4a0fcdd21b51",
  multipleStatements: true,
});*/

module.exports = con;
