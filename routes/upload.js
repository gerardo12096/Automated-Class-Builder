const express = require('express');
const router = express.Router();
const fs = require("fs");
const pdf = require("pdf-parse");
const app = express();
const http = require("http");
const path = require("path");
const upload = require("express-fileupload");

var mysql = require("mysql");
const { end } = require("../db_connect");
var db_connect = require("../db_connect");

//upload page
router.post("/upload", (req, res) => {
    res.render("upload");
});

//upload process
router.post("/drpupload", async (req, res) => {
    if (req.files) {
        console.log(req.files);
        var file = req.files.file;
        var filename = file.name;
        var location = "./DRP/" + filename;
        console.log(filename);
        await file.mv("./DRP/" + filename, function (err) {
            if (err) {
                res.send(err);
            } else {
                // res.send("File uploaded");
                pdf(location).then(function (data) {
                    console.log("wait for the function to get done!")
                    //All pdf content
                    const pdf = data.text;

                    //patterns
                    var PatternStudentId = new RegExp(/\d{9}/);

                    //Lastname
                    var LastnameStartIndex = pdf.indexOf("PREPARED:") + 11;
                    var LastnameEndIndex = pdf.indexOf(",", LastnameStartIndex);
                    var Lastname = pdf.substring(LastnameStartIndex, LastnameEndIndex);

                    //firstname
                    var FirstnameEndIndex = pdf.indexOf(" ", LastnameEndIndex + 1);
                    var Firstname = pdf.substring(
                        LastnameEndIndex + 1,
                        FirstnameEndIndex
                    );

                    //middlename
                    var MiddlenameEndIndex = pdf.indexOf("COMP", FirstnameEndIndex);
                    var MiddleName = pdf.substring(
                        FirstnameEndIndex + 1,
                        MiddlenameEndIndex
                    );

                    //console.log(Firstname);
                    //console.log(MiddleName);
                    //console.log(Lastname);

                    //information variables
                    const StudentId = pdf.match(PatternStudentId);
                    /*var sql =
                        "INSERT INTO `Student` (StudentId, Firstname, Middlename, Lastname) VALUES ('" +
                        StudentId +
                        "', '" +
                        Firstname +
                        "', '" +
                        MiddleName +
                        "', '" +
                        Lastname +
                        "')";
                    db_connect.query(sql, function (err, result) {
                        if (err) throw err;
                        console.log("1 record inserted");
                    });*/

                    var PatternCourse = new RegExp(
                        /^[0-9][0-9][A-Z]+ (([0-9]+)|([0-9]+L)|([0-9]+[A-Z])).*$/gm
                    );
                    let allCourse = pdf.match(PatternCourse);

                    function removeDuplicates(data) {
                        return data.filter((value, index) => data.indexOf(value) === index);
                    }
                    let course = removeDuplicates(allCourse);
                    //console.log(course);

                    for (let i = 0; i < course.length; i++) {
                        var specificCourse = course[i];
                        var term = specificCourse.substring(0, 2);
                        var semester = specificCourse.substring(2, 4);
                        var courseName = specificCourse.substring(
                            4,
                            specificCourse.indexOf(" ", 4)
                        );
                        var indexOfDecimal = specificCourse.indexOf(".");
                        var courseNumber = specificCourse.substring(
                            specificCourse.indexOf(" ") + 1,
                            indexOfDecimal - 1
                        );
                        var units = specificCourse.substring(
                            indexOfDecimal - 1,
                            indexOfDecimal + 2
                        );
                        var grade = specificCourse.substring(indexOfDecimal + 2);

                        var sql =
                            "INSERT INTO `coursecompletedbystudent` (StudentId, Term, Semester, Department, CourseNumber, Credits, Grade) VALUES ('" +
                            StudentId +
                            "', '" +
                            term +
                            "', '" +
                            semester +
                            "', '" +
                            courseName +
                            "', '" +
                            courseNumber +
                            "', '" +
                            units +
                            "', '" +
                            grade +
                            "')";
                        db_connect.query(sql, function (err, result) {
                            if (err) throw err;
                            console.log("1 record inserted");
                        });
                    }

                    var update = "UPDATE student SET dprParsed = " + 1 + " WHERE StudentId = " + StudentId + ";";
                    db_connect.query(update, function (err, result) {
                        if (err)
                            throw err;
                        console.log("parsed");
                    });
                });
            }
        })
        res.redirect('/planner');
    }
});

//planner page
router.get("/planner", (req, res) => {
    console.log(req.session.StudentId);
    let sqll = "SELECT Department, CourseNumber, Credits FROM coursecompletedbystudent WHERE StudentId = '" + req.session.StudentId + "' AND Grade = 'IP' ;";
    db_connect.query(sqll, (err, result) => {
        if (err) throw err;
        res.render("planner", { data: result });
    });
});

module.exports = router;