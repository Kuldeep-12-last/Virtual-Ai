import React, { createContext, useEffect, useState } from 'react'    
import axios from "axios"; // ✅ Correct for React frontend

export const UserDataContext=createContext()

function UserContext({children}) {   
    const ServerUrl="http://localhost:4000"     
    const [UserData,SetUserData]=useState(null)    
    const [FrontEndImage,setFrontEndImage]=useState(null) 
    const [BackEndImage,setBackEndImage]=useState(null)   
    const [SelectedImage,setSelectedImage]=useState(null)
   
    
    const HandleCurrentUser=async()=>{
        try {
              const result=await axios.get(`${ServerUrl}/api/user/current`
                ,{withCredentials:true})  
              console.log(result.data)
              SetUserData(result.data)
        } catch (error) {
            console.log(error)
        }
    }      
    const getGeminiResponse=async(command)=>{
      try {
        const result=await axios.post(`${ServerUrl}/api/user/asktoassistant`,{command},{withCredentials:true})  
        console.log("result",result)
        return result.data
      } catch (error) {   
        console.log("kuldeep")
        console.log(error)
      }
    }
    useEffect(()=>{
       HandleCurrentUser()
    },[])  
     const value={
      ServerUrl,UserData,SetUserData,FrontEndImage,
      setFrontEndImage,BackEndImage, setBackEndImage,
      SelectedImage,setSelectedImage,getGeminiResponse
    }  
   
  return (
    <div>
      <UserDataContext.Provider value={value}>
           {children}
      </UserDataContext.Provider>
    </div>
  )
}

export default UserContext
