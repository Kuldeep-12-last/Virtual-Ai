import React from 'react'     
import toast, { Toaster } from 'react-hot-toast';
import { useContext } from 'react'
import { Routes,Route, Navigate } from 'react-router-dom'
import Signup from './pages/Signup'
import Signin from './pages/Signin'
import Customize from './pages/Customize' 
import Customize2 from './pages/Customize2'
import Home from './pages/Home'
import { UserDataContext } from './context/UserContext'

function App() {   
const { ServerUrl,UserData,SetUserData,loadingUser }=useContext(UserDataContext)     
console.log("userdata is" ,UserData)   
  if (loadingUser) {
    return <h1 className="text-center mt-10 text-white">Loading...</h1>; 
  }
  return (
    <>   
    <Routes> 
      <Route path='/' element={UserData?.AssistantName&& UserData?.AssistantImage ?<Home/>: <Navigate to={"/Customize"}/>}/> 
      {/* <Route path='/' element={<Home/>}/>  */}
      <Route path='/Signup' element={!UserData?<Signup/>:<Navigate to={"/"} />}/>  
      {/* <Route path='/Signup' element={<Signup/>}/> */}
      <Route path='/Signin' element={!UserData?.AssistantName?<Signin/>:<Navigate to={"/"}/>} /> 
      <Route path='/Customize' element={UserData?<Customize/>:<Navigate to={"/Signup"}/>} />
      <Route path='/Customize2' element={UserData?<Customize2/>:<Navigate to={"/Signup"}/>} />   
      {/* <Route path='/Customize' element={<Customize/>}/>  
      <Route path='/Customize2' element={<Customize2/>}/>  */} 
      
    </Routes> 
    <Toaster/>
    </>
  )
}

export default App
