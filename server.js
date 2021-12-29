const express = require("express");
const session = require('express-session');
const app = express();
const path = require("path");
const upload = require("express-fileupload");
const flash = require('express-flash');

//--------import Routes----------------//
const loginRoute = require('./routes/login');
const uploadRoute = require('./routes/upload');

//-----------app uses---------------------//
app.use(express.urlencoded({ extended: false }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static("public"));
app.use("/css", express.static(__dirname + "public/css"));
app.use(upload());
app.use(flash());

app.use(session({secret:'XASDASDA'}));


//-------------routes------------------------//
app.use("/", loginRoute);
app.use("/", uploadRoute);

//-------------port-----------------------//
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port localhost:${PORT}`));