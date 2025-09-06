const express=require("express")  
const cors=require("cors")
const { connect } =require("./config/database");  
const cookieParser = require("cookie-parser");
const app=express(); 
const geminiResponse=require("./gemini")
require("dotenv").config();  
app.use(cookieParser())
app.use(express.json())  
app.use(cors({
    origin:"https://virtual-ai-frontends.onrender.com" ,
    credentials:true
}))
const Port=process.env.PORT||4000;
app.listen(Port,()=>{
    console.log(`app is listening on server ${Port}`);
})     

connect();     

const user=require("./routes/router") 
const current=require("./routes/current")
app.use("/api/auth", user);    
app.use("/api/user",current);  

app.use((req,res)=>{
    res.status(404).json({ message: "Route not found" });
});
