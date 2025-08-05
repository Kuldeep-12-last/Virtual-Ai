const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.auth = (req, res, next) => {
    console.log(req.cookies)
  try {
    // 1. Extract token from cookies
    const token = req.cookies.token;
    console.log("Verifying token:", token);

    if (!token) {   
      console.log("token is missing")
      return res.status(401).json({
        success: false,
        message: 'Token Missing',
      });
    }

    // 2. Verify token
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET);
     // console.log("Decoded Payload:", payload); 
      console.log(payload.data)

      // ✅ This should match how you sign the token
    //   req.userId = payload.data?._id || payload.userId; // support both structures   
    req.userId=payload.data
      console.log("user_id updated as",req.userId)
      next();
    } catch (error) {
      console.log("Invalid token error:", error.message);
      return res.status(401).json({
        success: false,
        message: 'Token is invalid',
      });
    }
  } catch (error) {
    console.log("Middleware error:", error.message);
    return res.status(500).json({
      success: false,
      message: 'Something went wrong during token verification',
    });
  }
};
