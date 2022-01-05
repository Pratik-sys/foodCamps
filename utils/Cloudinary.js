const cloudinary = require("cloudinary").v2;

const PreSets = (name, folder) => {
  return {
    folder: `${folder}`,
    use_filename: true,
    filename_override: `${name}-${new Date().toUTCString()}`,
    unique_filename: false,
  };
};

module.exports.CloudinaryUpload = async (image, name, folder) => {
  const result = await cloudinary.uploader.upload(image, PreSets(name, folder));
  return {
    cloudinary_ID: result.public_id,
    path: result.url,
  };
};

module.exports.DeleteImage = async (id) => {
  if (id != process.env.DEFAULT_IMAGE_ID || process.env.DEFAULT_AVATAR_ID) {
    await cloudinary.uploader.destroy(id);
  }
};
