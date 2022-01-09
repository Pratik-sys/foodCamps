const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const { User } = require("../models");

const Passport = (passport) => {
  passport.use(
    new LocalStrategy((username, password, done) => {
      User.findOne({ name: username }, async (err, user) => {
        if (err) {
          return done(err);
        }
        if (!user) {
          return done(null, false, { message: "Incorrect username." });
        }
        const comparehash = await bcrypt.compare(password, user.password);
        if (!comparehash) {
          return done(null, false, { message: "Incorrect password." });
        }
        return done(null, user);
      });
    })
  );
};

module.exports = Passport;