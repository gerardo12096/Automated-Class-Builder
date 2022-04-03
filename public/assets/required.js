var db_connect = require("../../db_connect");
var util = require("util");
const query = util.promisify(db_connect.query).bind(db_connect);

const required = [
  { CourseNumber: "150A" },
  { CourseNumber: "150B" },
  { CourseNumber: "262" },
  { CourseNumber: "341" },
  { CourseNumber: "230" },
  { CourseNumber: "110" },
  { CourseNumber: "122" },
  { CourseNumber: "182" },
  { CourseNumber: "222" },
  { CourseNumber: "256" },
  { CourseNumber: "282" },
  { CourseNumber: "310" },
  { CourseNumber: "322" },
  { CourseNumber: "333" },
  { CourseNumber: "380" },
  { CourseNumber: "482" },
  { CourseNumber: "490" },
  { CourseNumber: "491" },
];

let passed = [];

let needed = [];

for (var i = 0; i < required.length; i++) {
  //let dept = required[i].Department;
  let cno = required[i].CourseNumber;
  (async () => {
    let sql =
      "SELECT Department, courseNumber, grade FROM CourseCompletedByStudent WHERE StudentId = 200507859 AND (Department = 'MATH' OR Department = 'COMP' OR Department = 'PHIL') AND CourseNumber = '" +
      cno +
      "';";
    const rows = await query(sql);
    if (!(Object.entries(rows).length === 0)) {
      passed.push({ CourseNumber: rows[0].courseNumber });
    }
  })();
}

setTimeout(() => {
  //console.log("All required")
  //console.table(required);
  for (i = 0; i < required.length; i++) {
    if (!JSON.stringify(passed).includes(JSON.stringify(required[i]))) {
      needed.push(required[i]);
    }
  }
  // console.log("All needed")
  // console.table(needed);
  //console.log(JSON.stringify(passed));
  //db_connect.end();
}, 3000);
