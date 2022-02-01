//THIS IS THE OLD FILE !!!!!!!

//Connect to database
var mysql = require("mysql");
const con = require("./db_connect");
const { end } = require("./db_connect");
var db_connect = require("./db_connect");

var prereqChain1 = ["MATH 150A", "MATH 150B", "MATH 262", "MATH 482"];
var lastcourse = 0;

for (var i = 0; i < prereqChain1.length; i++) {
  var Cno = prereqChain1[i].substring(5, prereqChain1[i].length);
  let sqll =
    "SELECT * FROM CourseCompletedByStudent WHERE StudentId = '200507859' AND Department = 'MATH' AND CourseNumber = '" +
    Cno +
    "';";
  db_connect.query(sqll, (err, result) => {
    if (err) {
      console.log("HI inside err");
      throw err;
    }
    //console.log(result);
    if (!result[0]) {
      console.log("next course required = " + prereqChain1[lastcourse]);
      } else {
      if (result[0].Grade = "A" || "A-" || "B+" || "B" || "B-" || "C+" || "C" || "IP") {
        //console.log(i);
        console.log(result[0].CourseNumber + " passed");
        // console.log("Below is Cno");
        // console.log(Cno);
        i++;
        lastcourse++;
      }
    }
  });
}
db_connect.end();