const mongoose = require("mongoose");
const cloudinary = require("cloudinary");

module.exports.DBConfig = () => {
  mongoose.connect(process.env.DB_URL, (err, db) => {
    if (err) console.log("DB disconnected");
    console.log("DB connected");
  });
};

module.exports.CloudinaryConfig = () => {
  cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
};
