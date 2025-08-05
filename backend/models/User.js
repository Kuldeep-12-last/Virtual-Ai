const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
       // trim:true,
    },
    email:{
        type:String,
        required:true,   
        unique:true, 

           },
    password:{
        type:String,
        required:true,
    },
    AssistantName:{
        type:String,
    },
    AssistantImage:{
        type:String,
    }   ,
    history:[
        {
            type:String
        }
    ]
});

module.exports = mongoose.model("user", userSchema);
