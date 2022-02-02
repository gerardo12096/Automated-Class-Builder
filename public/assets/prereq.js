var db_connect = require("../../db_connect");

var prereq = require("./compCourses.json");

//get all courses which has this course in as prereq
let re = new RegExp('.*COMP 282.*');

let obj = prereq.filter(o => re.exec(o.prerequisite));
console.table(obj);

//var prereq = obj.map(function (i) { return { "course": i.Department + " " + i.CourseNumber, "prereq": i.prerequisite } });

//this loop goes over each object in the obj array
for (var i = 0; i < obj.length; i++) {
	console.log('Course: ' + obj[i].Department + ' ' + obj[i].CourseNumber);
	var eachCourse = obj[i].prerequisite.split("|");
	console.log("Prereqs: ")

	//this loop splits all AND in an array and OR's in other array
	for (var j = 0; j < eachCourse.length; j++) {
		var and = eachCourse[j].split("+");
		//console.log(and);

		//this loop is not functional right now, this loop should find all the courses in the array in the database to confirm whether student have taken and passed the courses and is eligible for the course.
		for (var check = 0; check < and.length; check++) {
			var coursename = and[check].substr(0, and[check].indexOf(' '));
			var courseno = and[check].substr(and[check].indexOf(' ') + 1);

			console.log(coursename, courseno);

			let sql = "SELECT courseNumber, grade FROM CourseCompletedByStudent WHERE StudentId = 200507859 AND Department = '" + coursename + "' AND CourseNumber = '" + courseno + "';";

			/*db_connect.query(sql, (err, result) => {
				if(result){
					console.table(result);
				}
			})*/
		}
		if(j != eachCourse.length - 1)
			console.log("OR");
	}
	console.log('');
}


//find it in the database
//return the result if found or else 