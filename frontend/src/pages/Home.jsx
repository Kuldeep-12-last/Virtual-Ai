import React, { useContext, useEffect, useRef, useState } from 'react'
import { UserDataContext } from '../context/UserContext'
import { useNavigate } from 'react-router-dom'  
import axios from 'axios';   
import aiImg from "../assets/ai.gif"
import userImg from "../assets/user.gif" 
import { AiOutlineMenu } from "react-icons/ai"; 
import { RxCross1 } from "react-icons/rx";
import toast from 'react-hot-toast';


function Home() {    
  const { UserData,ServerUrl,SetUserData,getGeminiResponse }=useContext(UserDataContext)  
  //console.log("Kalapani",UserData)  
  const [Listening,setListening]=useState(false) 
  const [UserText,setUserText]=useState("")  
  const [Ham,setHam]=useState(false)
  const [AiText,setAiText]=useState("")
  const isSpeakingRef=useRef(false) 
  const recognitionRef=useRef(null)  
  const isRecognizingRef=useRef(false)
  const synth=window.speechSynthesis
  const Navigate=useNavigate()  
  const handleLogout=async()=>{
    try {     console.log("logging out")
         const result=await axios.get(`${ServerUrl}/api/auth/Logout`,{withCredentials:true}) 
         Navigate("/Signup")  
         SetUserData(null)   
         console.log("UserData is ",UserData)
         console.log("logout successfully") 
         toast.success("Logout Successfully")
    } catch (error) {  
      console.log("error in handlelogout")
      console.log(error) 
      SetUserData(null)  
      toast.error("Failed to logout")
    }
  }      
  const startRecognition=()=>{
    try {
      recognitionRef.current?.start(); 
      setListening(true);
    } catch (error) {
      if(!error.message.includes("start")){
        console.log("Recognition error",error)
      }
    }
  } 
  const speak = (text) => {
  if (!text) return;
  
  const synth = window.speechSynthesis;
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'hi-IN';

  const setVoiceAndSpeak = () => {
    const voices = synth.getVoices();
    const hindiVoice = voices.find(v => v.lang === 'hi-IN') || voices[0];
    if (hindiVoice) {
      utterance.voice = hindiVoice;
    }
    synth.speak(utterance);
    isSpeakingRef.current = true;

    utterance.onend = () => {
      isSpeakingRef.current = false;
      setAiText("");
      setTimeout(() => startRecognition(), 800);
    };
  };

  // Wait for voices if not loaded yet
  if (synth.getVoices().length === 0) {
    synth.onvoiceschanged = setVoiceAndSpeak;
  } else {
    setVoiceAndSpeak();
  }
};
 
  const handleCommand=(data)=>{
    const {type,userInput,response}=data 
    speak(response);  
    console.log("user ne kya diya",userInput)
    
    if(type==='google_search'){
      const query=encodeURIComponent(userInput);
      window.open(`https://www.google.com/search?q=${query}`,'_blank');
    } 
    if(type==='calculator_open')
    {
      window.open(`https://www.google.com/search?q=calculator`,'_blank');
    }   
    if(type==='instagram_open')
    {
      window.open(`https://www.instagram.com/`,'_blank');
    }   
    if(type==='facebook_open')
    {
      window.open(`https://www.facebook.com/`,'_blank');
    } 
    if(type==='weather_show')
    {
      window.open(`https://www.google.com/search?q=weather`,'_blank');
    } 
    if(type==='youtube_search' || type==='youtube_play')
    {
      const query=encodeURIComponent(userInput);
     window.open(`https://www.youtube.com/results?search_query=${query}`, '_blank');

    }
  }
  useEffect(()=>{
       const SpeechRecognition=window.SpeechRecognition|| window.webkitSpeechRecognition   
       const recognition=new SpeechRecognition() 
       recognition.continuous=true,
       recognition.lang='en-US'     
       recognition.interimResults=false;
       recognitionRef.current=recognition  
       let isMounted=true;
         
       const startTimeout=setTimeout(()=>{
        if(isMounted && !isSpeakingRef.current && !isRecognizingRef.current){
          try {
            recognition.start(); 
            console.log("Recognition requested to start")
          } catch (error) {
            if(error.name!=="InvalidStateError"){
              console.log(error);
            }
          }
        }
       },1000)
       recognition.onstart=()=>{
        // console.log("Recognition started") 
        isRecognizingRef.current=true; 
        setListening(true);
       }
        recognition.onend=()=>{
        // console.log("Recognition ended") 
        isRecognizingRef.current=false; 
        setListening(false);   
        if(isMounted && !isSpeakingRef.current){
          setTimeout(()=>{
            if(isMounted){
              try {
                recognition.start(); 
                console.log("Recognition restarted")
              } catch (error) {
                if(error.name!=="InvalidStateError"){
                  console.error(error)
                }
              }
            }
          },1000);
        }
       };  
       recognition.onerror=(event)=>{
        console.warn("Recognition error",event.error);
        isRecognizingRef.current=false;
        setListening(false);
        if(event.error!=="aborted" && !isSpeakingRef.current){
          setTimeout(()=>{
           if(isMounted)
           {
            try {
              recognition.start(); 
              console.log("Recognition restarted after error")
            } catch (error) {
              if(error.name!== "InvalidStateError")
              {
                console.error(error);
              }
            }
           }
          },1000)
        }
       }
       recognition.onresult=async(e)=>{
        const transcript=e.results[e.results.length-1][0].transcript.trim() 
        // console.log("heard :",transcript) 
        if(transcript.toLowerCase().includes(UserData.AssistantName.toLowerCase())){  
          setUserText(transcript) 
          setAiText("")
          recognition.stop()
          isRecognizingRef.current=false 
          setListening(false)
          const data=await getGeminiResponse(transcript) 
          console.log(data)  
          handleCommand(data)  
          setAiText(data.response)
          setUserText("")
        }
       } 
     function greetUser() {
    const greeting = new SpeechSynthesisUtterance(`Hello ${UserData.name}, How can I help you?`);
    greeting.lang = 'hi-IN';
    greeting.onend = () => {
        startTimeout();
    };
    window.speechSynthesis.speak(greeting);
}

if (window.speechSynthesis.getVoices().length === 0) {
    window.speechSynthesis.onvoiceschanged = greetUser;
} else {
    greetUser();
}

      
      return  ()=>{ 
        isMounted=false;
        recognition.stop()
        setListening(false) 
        isRecognizingRef.current=false 
        // clearInterval(fallback) 
        clearTimeout(startTimeout)
      }
  },[])

  return (
    <div className="w-full h-[100vh] bg-gradient-to-t from-black to-[#02023d] flex 
     justify-center items-center flex-col gap-[15px] relative  overflow-hidden">    
       <AiOutlineMenu className='lg:hidden text-white absolute top-[20px] right-[20px] w-[25px] h-[25px]'
       onClick={()=>setHam(true)}/>  

       <div className={`absolute top-0 w-full h-full
       bg-[#00000018] backdrop-blur-lg p-[20px] 
       flex flex-col gap-[20px] items-start  lg:hidden
       ${Ham?"translate-x-0":"translate-x-full"} transition-transform`}>
      <RxCross1 className=' text-white absolute top-[20px] right-[20px] w-[25px] h-[25px]'
      onClick={()=>setHam(false)}/>   

      <button className='min-w-[150px] h-[60px]  text-black font-semibold bg-white
         rounded-full text-[19px]  cursor-pointer  ' 
         onClick={handleLogout} > 
         Logout
          </button> 

       <button className='min-w-[150px] h-[60px]  text-black font-semibold bg-white
         rounded-full text-[19px]  px-[20px] py-[10px] cursor-pointer '
         onClick={()=>Navigate("/Customize")} > 
         Customize Assistant
          </button>    
          <div className='w-full h-[2px] bg-gray-400' ></div>  
          <h1 className='text-white text-[19px] font-semibold'>History</h1>   
          <div className='w-full h-[60%] overflow-auto flex flex-col
          gap-[20px] items-start'> 
          {UserData.history?.map((his)=>(
            <span className='text-gray-400 text-[18px] '>{his}</span>   
          )
          )}

          </div>
       </div>

       <button className='min-w-[150px] h-[60px] mt-[30px] text-black font-semibold bg-white
         rounded-full text-[19px] absolute top-[20px] right-[20px] px-[20px] py-[10px] cursor-pointer hidden lg:block ' 
         onClick={handleLogout} > 
         Logout
          </button> 

       <button className='min-w-[150px] h-[60px] mt-[30px] text-black font-semibold bg-white
         rounded-full text-[19px] absolute top-[100px] right-[20px] px-[20px] py-[10px] cursor-pointer hidden lg:block'
         onClick={()=>Navigate("/Customize")} > 
         Customize Assistant
          </button> 

     <div className='w-[240px] h-[320px] flex justify-center
     items-center overflow-hidden rounded-4xl shadow-lg'> 
     <img src={UserData?.AssistantImage} alt="" className='h-full object-cover' />
     
     </div>  
     <h1 className='text-white text-[19px] font-semibold' >I'm {UserData?.AssistantName}</h1>
      {AiText && (
  <img 
    src={userImg} 
    className='w-[120px] h-[80px] opacity-80 mix-blend-screen drop-shadow-lg'
  />
)}
{!AiText && (
  <img 
    src={aiImg} 
    className='w-[120px] h-[80px]  mix-blend-screen drop-shadow-lg'
  />
)}
      <h1 className='text-white font-semibold'>{UserText?UserText:AiText?AiText:null}</h1>
    </div>
  )
}

export default Home
