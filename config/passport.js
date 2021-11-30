const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const { User } = require("../models");

module.exports = (passport) => {
  passport.use(
    new LocalStrategy((username, password, done) => {
      User.findOne({ name: username })
        .then(async (user) => {
          const comparehash = await bcrypt.compare(password, user.password);
          if (user && comparehash) {
            return done(null, user);
          }
          return done(null, false);
        })
        .catch((err) => console.log(err));
    })
  );
};
