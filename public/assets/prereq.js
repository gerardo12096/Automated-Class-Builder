var db_connect = require("../../db_connect");

var prereq = require("./compCourses.json");

//get all courses which has this course in as prereq
let re = new RegExp('.*COMP 282.*');

let obj = prereq.filter(o => re.exec(o.prerequisite));

var prereq = obj.map(function (i) { return { "course": i.Department + " " + i.CourseNumber, "prereq": i.prerequisite } });

//this loop goes over each object in the obj array
for (var i = 0; i < obj.length; i++) {
	console.log('Course: ' + obj[i].Department + ' ' + obj[i].CourseNumber);
	var eachCourse = obj[i].prerequisite.split("|");
	console.log("Prereqs: ")

	//this loop splits all AND in an array and OR's in other array
	for (var j = 0; j < eachCourse.length; j++) {
		var and = eachCourse[j].split("+");
		console.log(and);
		if(j != eachCourse.length - 1)
			console.log("OR");

		//this loop is not functional right now, this loop should find all the courses in the array in the database to confirm whether student have taken and passed the courses and is eligible for the course.
		for (var check = 0; check < and.length; check++) {
			let sql = "SELECT courseNumber, grade FROM CourseCompletedByStudent WHERE Department = '" + and[check].substr(0, and[check].indexOf(' ')) + "' AND CourseNumber = '" + and[check].substr(and[check].indexOf(' ') + 1) + "';";
			function checkGrades() {
				return new Promise((resolve, reject) => {
					db_connect.query(sql, function (err, data) {
						if (err) {
							return reject(err);
						}
						resolve(data);
					});
				})
			}

			async (req, res) => {
				try {
					const checking = await checkGrades();
					res.send(checking);
					console.log(checking);
				} catch (error) {
					res.status(500).send(error)
				}
			}
		}
	}
	console.log('');
}


//find it in the database
//return the result if found or else 