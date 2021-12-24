const express = require('express');
const { redirect } = require('express/lib/response');
const app = express();
const bodyparser = require('body-parser');
const router = express.Router();

var mysql = require("mysql");
const { end } = require("../db_connect");
var db_connect = require("../db_connect");

//show login page
router.get("/", (req, res) => {
    res.render("login");
});

//show registration page
router.get('/register', (req, res) => {
    res.render('register');
})

//registration process
router.post('/registerUser', (req, res) => {
    var name = req.body.name;
    var csunid = req.body.id;
    var email = req.body.email;
    var username = req.body.username;
    var password = req.body.password;
    var repassword = req.body.repassword;
    if (password != repassword) {
        res.render('register', { error: 'Passwords do not match' });
    }
    /*if (csunid.length() != 9) {
        res.render('register', { error: 'Invalid CSUN ID' });
    }*/
    /*let sql = "SELECT * FROM Student WHERE Username = " + username + ";";
    db_connect.query(sql, function (err, result) {
        if (err) throw err;
        if (result[0] == username) {
            res.render('register', { error: 'Username already taken' });
        }
    });*/

    var reg =
        "INSERT INTO `student` (StudentId, Name, Email, Username, Password) VALUES ('" +
        csunid +
        "', '" +
        name +
        "', '" +
        email +
        "', '" +
        username +
        "', '" +
        password +
        "')";
    db_connect.query(reg, (err, result) => {
        if (err) throw err;
        res.redirect("/");
    });
});

//login process
router.post("/loginUser", (req, res) => {
    var username = req.body.username;
    var password = req.body.password;
    if (username && password) {
        let sql = "SELECT * FROM student WHERE Username = '" + username + "' AND Password = '" + password + "';";
        db_connect.query(sql, (err, result) => {
            if (result) {
                if (result[0].dprParsed == 0) {
                    res.redirect(307, "/upload");
                } else {
                    let sqll = "SELECT Department, CourseNumber, Credits FROM coursecompletedbystudent WHERE StudentId = '" + result[0].StudentId + "' AND Grade = 'IP' ;";
                    db_connect.query(sqll, (err, result) => {
                        if (err) throw err;
                        res.render("planner", { data: result });
                    });
                }
            } else {
                console.log(err);
                res.redirect("/");
            }
        })
    }
})

router.get("/logout", (req,res) => {
    res.redirect("/");
})

module.exports = router;