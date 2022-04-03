var db_connect = require("../../db_connect");
var util = require("util");
const query = util.promisify(db_connect.query).bind(db_connect);

var prereq = require("./compCourses.json");
let showCourses = []; //show courses on front end
let p = []; //p for prereq!

(async () => {
  let sqll =
    "SELECT Department, CourseNumber FROM coursecompletedbystudent WHERE StudentId = 200507859 AND Department = 'COMP' OR Department = 'MATH';";
  coursesCompleted = await query(sqll);
  coursesCompleted = JSON.parse(JSON.stringify(coursesCompleted));
  //console.log("RESULT 1");
  // console.table(coursesCompleted);
  for (a = 0; a < coursesCompleted.length; a++) {
    //get all courses which has this course in as prereq
    let re = new RegExp(
      ".*" +
        coursesCompleted[a].Department +
        " " +
        coursesCompleted[a].CourseNumber +
        ".*"
    );
    //console.log('.*' + coursesCompleted[a].Department + ' ' + coursesCompleted[a].CourseNumber + '.*');

    let obj = prereq.filter((o) => re.exec(o.prerequisite));
    // console.table(obj);

    //var prereq = obj.map(function (i) { return { "course": i.Department + " " + i.CourseNumber, "prereq": i.prerequisite } });

    //this loop goes over each object in the obj array
    for (var i = 0; i < obj.length; i++) {
      //console.log('Course: ' + obj[i].Department + ' ' + obj[i].CourseNumber);
      var eachCourse = obj[i].prerequisite.split("|");
      //console.log("Prereqs: ")

      //this loop splits all AND in an array and OR's in other array
      for (var j = 0; j < eachCourse.length; j++) {
        var and = eachCourse[j].split("+");
        //console.log(and);

        //this loop is not functional right now, this loop should find all the courses in the array in the database to confirm whether student have taken and passed the courses and is eligible for the course.
        var check = 0;
        while (check < and.length) {
          var coursename = and[check].substr(0, and[check].indexOf(" "));
          var courseno = and[check].substr(and[check].indexOf(" ") + 1);

          // console.log(coursename + " " + courseno);

          let sql =
            "SELECT Department, courseNumber, grade FROM CourseCompletedByStudent WHERE StudentId = 200507859 AND Department = '" +
            coursename +
            "' AND CourseNumber = '" +
            courseno +
            "';";
          let rows = await query(sql);
          rows = JSON.parse(JSON.stringify(rows));
          if (Object.entries(rows).length === 0) {
            // console.log("break happened");
            p = [];
            break;
          }
          // console.log(rows);
          if (rows[0].grade === "A" || "A-" || "B+" || "B" || "B-" || "C+") {
            p.push(rows);
          }
          if (p.length >= and.length - 1) {
            showCourses.push({
              Department: obj[i].Department,
              CourseNumber: obj[i].CourseNumber,
            });
            // console.log("Department", obj[i].Department, "CourseNumber", obj[i].CourseNumber);
            // console.log('');
          }
          check++;
        }
      }
    }
  }
  // console.log("SHOW COURSES ");

  //remove duplicates
  const uniqueIds = [];
  let unishowcourses = showCourses.filter((element) => {
    const isDuplicate = uniqueIds.includes(element.CourseNumber);

    if (!isDuplicate) {
      uniqueIds.push(element.CourseNumber);

      return true;
    }
  });

  for (d = 0; d < coursesCompleted.length; d++) {
    let courseToDelete = coursesCompleted[d].CourseNumber;
    let ind = unishowcourses.findIndex((e) => e.CourseNumber == courseToDelete);
    if (ind != -1) {
      unishowcourses.splice(ind, 1);
    }
  }
  unishowcourses.sort((a, b) => a.CourseNumber - b.CourseNumber);
  //console.table(unishowcourses);
  db_connect.end();
})();

//delete courses which are already taken
//make a for loop for the IP classes at the top
