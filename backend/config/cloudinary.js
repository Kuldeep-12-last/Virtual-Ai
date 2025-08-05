const cloudinary = require('cloudinary').v2;
const fs = require("fs");
const UploadOnCloudinary=async(filePath)=>{
      cloudinary.config({ 
        cloud_name: process.env.CLOUD_NAME, 
        api_key: process.env.CLOUD_API,
        api_secret: process.env.CLOUD_SECRET// Click 'View API Keys' above to copy your API secret
    }); 

    try {
           const uploadResult = await cloudinary.uploader
       .upload(filePath)  
       fs.unlinkSync(filePath)
       return uploadResult.secure_url 
    } catch (error) {
          fs.unlinkSync(filePath) 
          return res.status(500).json({
            success:false,
            message:"Something wrong while accessing image"
          })
    }
}  
module.exports = UploadOnCloudinary