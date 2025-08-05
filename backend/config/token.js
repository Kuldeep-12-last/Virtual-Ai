const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.GenerateToken = (data) => {  
  console.log("generate token is called")
  try {
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined in environment variables.");
    }

    const token = jwt.sign({ data }, process.env.JWT_SECRET, { expiresIn: "3d" });
    console.log(token);
    return token;
  } catch (err) {
    console.error("Token generation error:", err.message);
    return null;
  }
};
