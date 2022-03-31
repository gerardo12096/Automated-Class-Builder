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
var util = require('util');
const query = util.promisify(db_connect.query).bind(db_connect);

//upload page
router.post("/upload", (req, res) => {
    res.render("upload");
});

//upload process
router.post("/drpupload", async (req, res) => {
    if (req.files) {
        //console.log(req.files);
        var file = req.files.file;
        var filename = file.name;
        var location = "./DRP/" + filename;
        //console.log(filename);
        await file.mv("./DRP/" + filename, function (err) {
            if (err) {
                res.send(err);
            } else {
                // res.send("File uploaded");
                pdf(location).then(function (data) {
                    //console.log("wait for the function to get done!")
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

                    ////console.log(Firstname);
                    ////console.log(MiddleName);
                    ////console.log(Lastname);

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
                        //console.log("1 record inserted");
                    });*/

                    var PatternCourse = new RegExp(
                        /^[0-9][0-9][A-Z]+ (([0-9]+)|([0-9]+L)|([0-9]+[A-Z])).*$/gm
                    );
                    let allCourse = pdf.match(PatternCourse);

                    function removeDuplicates(data) {
                        return data.filter((value, index) => data.indexOf(value) === index);
                    }
                    let course = removeDuplicates(allCourse);
                    ////console.log(course);

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
                            //console.log("1 record inserted");
                        });
                    }

                    var update = "UPDATE student SET dprParsed = " + 1 + " WHERE StudentId = " + StudentId + ";";
                    db_connect.query(update, function (err, result) {
                        if (err)
                            throw err;
                        //console.log("parsed");
                    });
                });
            }
        })
        res.redirect('/planner');
    }
});

//planner page
router.get("/planner", (req, res) => {
    //console.log(req.session.StudentId);
    //In progress
    let result1;
    (async () => {
        let sql1 = "SELECT Department, CourseNumber, Credits FROM coursecompletedbystudent WHERE StudentId = '" + req.session.StudentId + "' AND Grade = 'IP' ;";
        result1 = await query(sql1);
        //console.log(result1);

        //reuqired
        const required = [
            { 'Department': 'MATH', 'CourseNumber': '150A' },
            { 'Department': 'MATH', 'CourseNumber': '150B' },
            { 'Department': 'MATH', 'CourseNumber': '262' },
            { 'Department': 'MATH', 'CourseNumber': '341' },
            { 'Department': 'PHIL', 'CourseNumber': '230' },
            { 'Department': 'COMP', 'CourseNumber': '110' },
            { 'Department': 'COMP', 'CourseNumber': '122' },
            { 'Department': 'COMP', 'CourseNumber': '182' },
            { 'Department': 'COMP', 'CourseNumber': '222' },
            { 'Department': 'COMP', 'CourseNumber': '256' },
            { 'Department': 'COMP', 'CourseNumber': '282' },
            { 'Department': 'COMP', 'CourseNumber': '310' },
            { 'Department': 'COMP', 'CourseNumber': '322' },
            { 'Department': 'COMP', 'CourseNumber': '333' },
            { 'Department': 'COMP', 'CourseNumber': '380' },
            { 'Department': 'COMP', 'CourseNumber': '482' },
            { 'Department': 'COMP', 'CourseNumber': '490' },
            { 'Department': 'COMP', 'CourseNumber': '491' }
        ];

        let passed = [];
        let needed = [];
        for (var i = 0; i < required.length; i++) {
            //let dept = required[i].Department;
            let cno = required[i].CourseNumber;
            let sql = "SELECT Department, courseNumber, grade FROM CourseCompletedByStudent WHERE StudentId = '" + req.session.StudentId + "' AND (Department = 'MATH' OR Department = 'COMP' OR Department = 'PHIL') AND CourseNumber = '" + cno + "';";
            const rows = await query(sql);
            if (!(Object.entries(rows).length === 0)) {
                passed.push({ 'Department': rows[0].Department, 'CourseNumber': rows[0].courseNumber });
            }
        }
        //console.log("All required")
        console.table(required);
        for (i = 0; i < required.length; i++) {
            if (!(JSON.stringify(passed).includes(JSON.stringify(required[i])))) {
                needed.push(required[i]);
            }
        }
        //console.log("All needed")
        console.table(needed);
        //console.log(JSON.stringify(passed));

        //Recommended
        var prereq = require("../public/assets/compCourses.json");
        let showCourses = [];	//show courses on front end
        let p = []; 			//p for prereq!
        let unishowcourses = [];


        let sqll = "SELECT Department, CourseNumber FROM coursecompletedbystudent WHERE StudentId = 200507859 AND Department = 'COMP' OR Department = 'MATH';";
        coursesCompleted = await query(sqll);
        coursesCompleted = JSON.parse(JSON.stringify(coursesCompleted));
        //console.log("RESULT 1");
        console.table(coursesCompleted);
        for (a = 0; a < coursesCompleted.length; a++) {
            //get all courses which has this course in as prereq
            let re = new RegExp('.*' + coursesCompleted[a].Department + ' ' + coursesCompleted[a].CourseNumber + '.*');
            ////console.log('.*' + coursesCompleted[a].Department + ' ' + coursesCompleted[a].CourseNumber + '.*');

            let obj = prereq.filter(o => re.exec(o.prerequisite));
            console.table(obj);

            //var prereq = obj.map(function (i) { return { "course": i.Department + " " + i.CourseNumber, "prereq": i.prerequisite } });

            //this loop goes over each object in the obj array
            for (var i = 0; i < obj.length; i++) {
                //console.log('Course: ' + obj[i].Department + ' ' + obj[i].CourseNumber);
                var eachCourse = obj[i].prerequisite.split("|");
                //console.log("Prereqs: ")

                //this loop splits all AND in an array and OR's in other array
                for (var j = 0; j < eachCourse.length; j++) {
                    var and = eachCourse[j].split("+");
                    ////console.log(and);

                    //this loop is not functional right now, this loop should find all the courses in the array in the database to confirm whether student have taken and passed the courses and is eligible for the course.
                    var check = 0;
                    while (check < and.length) {
                        var coursename = and[check].substr(0, and[check].indexOf(' '));
                        var courseno = and[check].substr(and[check].indexOf(' ') + 1);

                        //console.log(coursename + " " + courseno);

                        let sql = "SELECT Department, courseNumber, grade FROM CourseCompletedByStudent WHERE StudentId = 200507859 AND Department = '" + coursename + "' AND CourseNumber = '" + courseno + "';";
                        let rows = await query(sql);
                        rows = JSON.parse(JSON.stringify(rows));
                        if (Object.entries(rows).length === 0) {
                            //console.log("break happened");
                            p = [];
                            break;
                        }
                        //console.log(rows);
                        if (rows[0].grade == "A" || "A-" || "B+" || "B" || "B-" || "C+") {
                            p.push(rows);
                        }
                        if (p.length >= and.length) {
                            showCourses.push({ "Department": obj[i].Department, "CourseNumber": obj[i].CourseNumber });
                        }
                        check++;
                    }
                }
            }
        }
        //console.log("SHOW COURSES ");

        //remove duplicates
        const uniqueIds = [];
        unishowcourses = showCourses.filter(element => {
            const isDuplicate = uniqueIds.includes(element.CourseNumber);

            if (!isDuplicate) {
                uniqueIds.push(element.CourseNumber);

                return true;
            }
        });

        for (d = 0; d < coursesCompleted.length; d++) {
            let courseToDelete = coursesCompleted[d].CourseNumber;
            let ind = unishowcourses.findIndex(e => e.CourseNumber == courseToDelete);
            if (ind != -1) {
                unishowcourses.splice(ind, 1);
            }
        }
        unishowcourses.sort((a, b) => a.CourseNumber - b.CourseNumber);
        console.table(unishowcourses);
        db_connect.end();

        res.render("planner", { data: result1, data2: needed, data3: unishowcourses });
    })()
});

module.exports = router;