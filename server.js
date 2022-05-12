const express = require("express");
const session = require("express-session");
const app = express();
const path = require("path");
const cookieParser = require("cookie-parser");
const upload = require("express-fileupload");
const flash = require("express-flash");

//--------import Routes----------------//
const loginRoute = require("./routes/login");
const uploadRoute = require("./routes/upload");
const profileRoute = require("./routes/profile");
const adminRoute = require("./routes/admin");

//-----------app uses---------------------//
app.use(express.urlencoded({ extended: false }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static("public"));
app.use("/css", express.static(__dirname + "public/css"));
app.use("/javascript", express.static(__dirname + "public/javascript"));
app.use(upload());
app.use(flash());
app.use(cookieParser());
app.use(
  session({
    resave: true,
    saveUninitialized: true,
    secret: "secret",
  })
);

//-------------routes------------------------//
app.use("/", loginRoute);
app.use("/", uploadRoute);
app.use("/", profileRoute);
app.use("/", adminRoute);

//-------------port-----------------------//
const PORT = 3000;
app.listen(PORT, () => console.log(`Server started on port localhost:${PORT}`));
