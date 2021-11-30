const mongoose = require("mongoose");

module.exports.DBConfig = () => {
  mongoose.connect(process.env.DB_URL, (err, db) => {
    if (err) console.log("DB disconnected");
    console.log("DB connected");
  });
};
