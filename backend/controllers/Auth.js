const bcrypt = require("bcryptjs");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
//const { options } = require("../routes/user");   
const {GenerateToken} =require("../config/token")



//signup route handler
exports.signup = async (req,res) => {
    try{
        //get data
        const {name, email, password} = req.body;
        //check if user already exist
        const existingUser = await User.findOne({email});
        console.log(req.body);
        if(existingUser){
            return res.status(400).json({
                success:false,
                message:'Email already Exists',
            });
        }  
        if(password.length<8)
        {
            return res.status(401).json({
                success:false,
                message:'Password length should be greater than 8',
            });
        }

        //secure password
        let hashedPassword;
        try{
            hashedPassword = await bcrypt.hash(password, 10);
        }
        catch(err) {
            return res.status(500).json({
                success:false,
                message:'Error inn hashing Password',
            });
        }

        //create entry for User
        const user = await User.create({
            name,email,password:hashedPassword
        }) 
        const token=await GenerateToken(user._id) 
        res.cookie("token",token,{
            httpOnly:true,
            maxAge:2*24*60*60*1000,
            sameSite:"strict",  
            secure:false

        })

        return res.status(200).json({
            success:true,
            message:'User Created Successfully', 
            user:user
        });

    }
    catch(error) {
        console.error(error);
        return res.status(500).json({
            success:false,
            message:'User cannot be registered, please try again later',
        });
    }
}     



exports.login = async (req,res) => {  
    console.log("login is called")
    try {

        //data fetch
        const {email, password} = req.body;
        //validation on email and password
        //console.log(email,password);
        if(!email || !password) {
            return res.status(400).json({
                success:false,
                message:'PLease fill all the details carefully',
            });
        }

        //check for registered user
        let user = await User.findOne({email});  
        //console.log("user is ",user)
        //if not a registered user
        if(!user) {
            return res.status(401).json({
                success:false,
                message:'User is not registered',
            });
        }

       
        //verify password & generate a JWT token
        let isMAtched=await bcrypt.compare(password,user.password);
        
        if( isMAtched) {
            //password match 
           // console.log("finding token")
                const token=await GenerateToken(user._id)  
             //   console.log("token :",token)
               res.cookie("token",token,{
                 httpOnly:true,
                 maxAge:2*24*60*60*1000,
                 sameSite:"strict",  
                 secure:false

        })   

            return res.status(200).json({
            success:true,
            message:'User Login Successfully', 
            user:user
            
        });
        }
        else {
            //passwsord do not match
            return res.status(403).json({
                success:false,
                message:"Password Incorrect",
            });
        }

    }
    catch(error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:'Login Failure',
        });

    }
}   
exports.logout=async(req,res)=>{
    try{       //console.log(req)  
        console.log("logout is called")
          res.clearCookie("token",{
                 httpOnly:true,
                
                 sameSite:"strict",  
                 secure:false

        })       
            //console.log(req)
            return res.status(200).json({
            success:true,
            message:'User Logout Successfully',
        });
    }  
      catch(error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:'Logout Failure',
        });

    }
}