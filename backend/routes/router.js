const express=require("express")
const router=express.Router();   
const {auth} =require("../middlewares/auth")  
const {login,signup,logout} =require("../controllers/Auth");  


router.post("/Signup",signup)
router.post("/Signin",login)  
router.get("/Logout",logout)
module.exports= router