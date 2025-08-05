const User = require("../models/User.js");  
const moment =require("moment")   

const UploadOnCloudinary =require('../config/cloudinary');
const geminiResponse = require("../gemini");
exports.GetCurrentUser=async(req,res)=>{   
   // console.log("user req is ",req.userId)
    try{
      const userId=req.userId 
      const currentUser = await User.findById(userId)  
      if(!currentUser){   
        console.log("user is not found")
        return  res.status(500).json({
        success:false,
        message:"No informatiom about this user"
       })   
      }

       console.log("user found")
       return  res.status(200).json({
        success:true,
        message:"user Found successfully"}) 
        user:currentUser
    }  
    catch(err)
    {
         console.log(err)
         return res.status(400).json({
            success:false,
            message:"get current user error"
         })
    }
}  
  
exports.updateAssistant=async(req,res)=>{
    try {   
        
        const { AssistantName,imageUrl}=req.body 
        
        let AssistantImage; 
        if(req.file){
            AssistantImage=await UploadOnCloudinary(req.file.path)
        } 
        else
        {
           AssistantImage=imageUrl
        }    
        console.log("userId",req.userId)
        const user=await User.findByIdAndUpdate(req.userId,{
            AssistantName,AssistantImage
        },{new:true}).select("-password")  
        // console.log("kuldeep")
        console.log(user);
        return res.status(200).json(user)
    } catch (error) {
         console.log(error)
         return res.status(400).json({
            success:false,
            message:"get current user error while updating"
         })
    }
}    

exports.askToAssistant=async(req,res)=>{
    try {
        const {command}=req.body
        const user=await User.findById(req.userId)
        const userName=user.name  
        user.history.push(command) 
        user.save()
        const AssistantName=user.AssistantName  
        const result=await geminiResponse(command,AssistantName,userName) 
        const jsonMatch=result.match(/{[\s\S]*}/) 
        if(!jsonMatch)
        {
            return res.status(400).json({response: " sorry i can't understand"})
        }   
        const gemResult=JSON.parse(jsonMatch[0])  
        const type=gemResult.type 

        switch(type){  
            case 'get_date' :
                return res.json({
                    type,
                    userInput: gemResult.userInput,
                    response:`current date is ${moment().format
                        ("YYYY-MM-DD") }`
                })   ;
             case 'get_time' :
                return res.json({
                    type,
                    userInput: gemResult.userInput,
                    response:`current time is  is ${moment().format
                        ("hh:mm A") }`
                });   
             case 'get_day' :
                return res.json({
                    type,
                    userInput: gemResult.userInput,
                    response:`today is ${moment().format
                        ("dddd") }`
                });
             case 'get_month' :
                return res.json({
                    type,
                    userInput: gemResult.userInput,
                    response:`current month is ${moment().format
                        ("MMMM") }`
                }); 
                case 'youtube_search' :
                case 'youtube_play': 
                case 'youtube_search': 
                case 'general': 
                case "calculator_open" :
                case "instagram_open" : 
                case "facebook_open" : 
                case "weather_show" : 
                return res.json({
                    type,
                    userInput:gemResult.userInput ,
                    response:gemResult.response
                })
        default:  
             return res.status(400).json({
                response:" I didn't understand that command . "
             })
                

        }

    } catch (error) {
          return res.status(500).json({
                response:" ask assistant error . "
             })
    }
}