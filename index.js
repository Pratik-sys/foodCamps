const express = require("express");
const app = express();

const config = require("./config");
const passport = require("passport");
const cookieParser = require("cookie-parser");
const LocalStrategy = require("passport-local");
const flash = require("connect-flash");
const User = require("./models/user");
const commentRoutes = require("./routes/comments");
const foodgroundRoutes = require("./routes/foodgrounds");
const indexRoutes = require("./routes/index");

require("dotenv").config();

config.DBConfig();

app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(cookieParser("secret"));

//require moment
app.locals.moment = require("moment");
// seedDB(); //seed the database

// PASSPORT CONFIGURATION
app.use(
  require("express-session")({
    secret: "Once again you broke the code!",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function (req, res, next) {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

app.use("/", indexRoutes);
app.use("/foodgrounds", foodgroundRoutes);
app.use("/foodgrounds/:id/comments", commentRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server running at port ${process.env.PORT}`);
});
