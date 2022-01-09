const mongoose = require("mongoose");
const DBConfig = () => {
  mongoose.connect(process.env.DB_URL, (err, db) => {
    if (err) console.log("DB disconnected");
    console.log("DB connected");
  });
};

module.exports = DBConfig;
