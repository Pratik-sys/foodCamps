const express = require("express");
const passport = require("passport");
const app = express();
require("dotenv").config();
const config = require("./config");
const { GenAdmin } = require("./utils");
const { User } = require("./models");
const methodOveride = require("method-override");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");
const commentRoutes = require("./routes/comments");
const foodgroundRoutes = require("./routes/foodgrounds");
const adminRoutes = require("./routes/Admin");
const indexRoutes = require("./routes/index");

config.DB();
config.CloudinaryConfig();

config.Passport(passport);

app.use(GenAdmin);

app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(flash());

app.use(cookieParser("secret"));

app.locals.moment = require("moment");

app.use(methodOveride("_method"));

app.use(
  session({
    secret: process.env.SECRETE_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 600000,
    },
  })
);
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

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

app.use("/", indexRoutes);
app.use("/foodgrounds", foodgroundRoutes);
app.use("/foodgrounds/:id/comments", commentRoutes);
app.use("/admin", adminRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server running at port ${process.env.PORT}`);
});
