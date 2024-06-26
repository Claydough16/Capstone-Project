require("dotenv").config();
const cloudinary = require("cloudinary").v2;

//Cloudinary settings
cloudinary.config({
  secure: true,
});
/* 
console.log(cloudinary.config().api_key);
console.log(cloudinary.config().cloud_name);
console.log(cloudinary.config().api_secret);
*/
const uploadImage = async (imagePath) => {
  // Use the uploaded file's name as the asset's public ID and
  // allow overwriting the asset with new versions
  const options = {
    use_filename: true,
    unique_filename: false,
    overwrite: true,
    resource_type: "auto",
  };

  try {
    // Upload the image
    const result = await cloudinary.uploader.upload(imagePath, options);
    return result.secure_url;
  } catch (error) {
    console.error(error);
  }
};

module.exports = uploadImage;
