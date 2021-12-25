const express = require("express");
const app = express();

const methodOveride = require("method-override");
const config = require("./config");
const passport = require("passport");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");
const commentRoutes = require("./routes/comments");
const foodgroundRoutes = require("./routes/foodgrounds");
const adminRoutes = require("./routes/Admin");
const indexRoutes = require("./routes/index");
const { User } = require("./models");
const { GenAdmin } = require("./utils/CreateAdmin");

require("dotenv").config();
require("./config/passport")(passport);
config.DBConfig();
config.CloudinaryConfig();
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(cookieParser("secret"));
app.use(GenAdmin);
//require moment
app.locals.moment = require("moment");
// seedDB(); //seed the database

app.use(methodOveride("_method"));
// PASSPORT CONFIGURATION
app.use(
  session({
    secret: process.env.SECRETE_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: {
      expires: 600000,
    },
  })
);

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

app.use(function (req, res, next) {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

app.use("/", indexRoutes);
app.use("/foodgrounds", foodgroundRoutes);
app.use("/foodgrounds/:id/comments", commentRoutes);
app.use("/admin/", adminRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server running at port ${process.env.PORT}`);
});
