const cloudinary = require('cloudinary').v2;
const fs = require("fs");

// Configure Cloudinary once
cloudinary.config({ 
  cloud_name: process.env.CLOUD_NAME, 
  api_key: process.env.CLOUD_API,
  api_secret: process.env.CLOUD_SECRET
}); 

const UploadOnCloudinary = async (filePath) => { 
  console.log("filepath is" ,filePath);
  try {
    if (!filePath) return null;

    // Upload file
    const uploadResult = await cloudinary.uploader.upload(filePath);  
    console.log("upload result is",uploadResult)

    // Remove local file after upload
    fs.unlinkSync(filePath);

    return uploadResult.secure_url; // return image URL
  } catch (error) {
    // Remove local file if something goes wrong
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Throw error instead of using res
    throw new Error("Cloudinary upload failed: " + error.message);
  }
};

module.exports = UploadOnCloudinary;
