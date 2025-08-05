const express=require("express")  
const {auth} =require("../middlewares/auth")  
const upload=require("../middlewares/multer")
const router2=express.Router();    
const { GetCurrentUser, updateAssistant, askToAssistant } = require("../controllers/userInfo");
router2.get("/current", auth, GetCurrentUser );
router2.post("/update", auth,upload.single("AssistantImage"), updateAssistant );
router2.post("/asktoassistant",auth,askToAssistant)
module.exports=router2