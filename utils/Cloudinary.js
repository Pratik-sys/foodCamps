const cloudinary = require("cloudinary");

const PreSets = (name) => {
  return {
    folder: "foodgrounds",
    use_filename: true,
    filename_override: `${name}-${new Date().toUTCString()}`,
    unique_filename: false,
  };
};

module.exports.CloudinaryUpload = async (image, name) => {
  const result = await cloudinary.uploader.upload(image, PreSets(name));
  return {
    cloudinary_ID: result.public_id,
    path: result.url,
  };
};

module.exports.DeleteImage = async (id) => {
  if (id != process.env.DEFAULT_IMAGE_ID) {
    await cloudinary.uploader.destroy(id);
  }
};
