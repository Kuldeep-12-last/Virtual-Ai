import React from 'react'      
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import { BsFillImageFill } from "react-icons/bs";
import Card from '../components/Card'
import image1 from '../assets/image1.png'
import image2 from '../assets/image2.jpg'
import image3 from '../assets/image3.png'
import image4 from '../assets/image4.png'
import image5 from '../assets/image5.png' 
import image6 from '../assets/image6.jpeg'
import image7 from '../assets/image7.jpeg'
import image8 from '../assets/image8.png'
import image10 from '../assets/image10.jpg'
import image11 from '../assets/image11.jpg'
import image12 from '../assets/image12.png'
import { useState } from 'react';
import { useRef } from 'react';
import { useContext } from 'react';
import { UserDataContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
function Customize() {   
  const {ServerUrl,UserData,SetUserData,FrontEndImage,
      setFrontEndImage,BackEndImage,setBackEndImage,
      SelectedImage,setSelectedImage} = useContext(UserDataContext)
  const InputImage=useRef()    
  const Navigate=useNavigate()
  const changeHandler=(event)=>{
    const file=event.target.files[0]  
    setBackEndImage(file) 
    setFrontEndImage(URL.createObjectURL(file))
  }
  return (
    <div className="w-full h-[100vh] bg-gradient-to-t from-black to-[#040488ac] flex
     justify-center items-center flex-col p-[20px] gap-[20px]">   
     <MdOutlineKeyboardBackspace  className=' absolute left-[30px] top-[30px] text-white  w-[25px] h-[25px] cursor-pointer' 
         onClick={()=>Navigate("/")}/>
    <h1 className='text-white text-[30px] text-center'>Select Your 
       <span className='text-blue-500'>Assistant Image</span></h1>
      <div className='w-full max-w-[850px] flex justify-center items-center flex-wrap gap-[30px]'> 
         <Card image={image1}/> 
       <Card image={image2}/>
       <Card image={image3}/>
       <Card image={image4}/>
       <Card image={image5}/>
       <Card image={image6}/>
       <Card image={image7}/>
       <Card image={image8}/>
       <Card image={image10}/>
       <Card image={image11}/>
       <Card image={image12}/>    
       <div className={`w-[65px] h-[130px] lg:w-[95px] lg:h-[160px] bg-[#030326] border-2 border-[#0000ff85] rounded-2xl overflow-y-hidden
    hover:shadow-2xl hover: shadow-blue-700  hover:border-4 hover:border-amber-50 cursor-pointer flex justify-center items-center
    ${SelectedImage == "input" 
      ? "border-4 border-amber-50 shadow-2xl shadow-blue-700"
      :null
    }`}
    onClick={()=> { InputImage.current.click()  
                    setSelectedImage("input")
                  }
    }> 
     { !FrontEndImage &&  <BsFillImageFill className='text-white w-[55px] h-[55px]' />}   
     {  FrontEndImage &&  <img src={FrontEndImage} className='h-full object-cover'/>}
    </div>  
    <input type="file" accept='image/*' hidden ref={InputImage} onChange={changeHandler}/>
      </div>   
      {SelectedImage && <button className='min-w-[150px] h-[60px] mt-[30px] text-black font-semibold bg-white
         rounded-full text-[19px] cursor-pointer' onClick={()=>{
          Navigate("/Customize2")
         }}>Next</button>}
    </div>
  )
}

export default Customize
