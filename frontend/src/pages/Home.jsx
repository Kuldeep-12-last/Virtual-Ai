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
  const { UserData, ServerUrl, SetUserData, getGeminiResponse } = useContext(UserDataContext)
  const [Listening, setListening] = useState(false)
  const [UserText, setUserText] = useState("")
  const [Ham, setHam] = useState(false)
  const [AiText, setAiText] = useState("")

  const isSpeakingRef = useRef(false)
  const recognitionRef = useRef(null)
  const isRecognizingRef = useRef(false)
  const mountedRef = useRef(true)

  const synthRef = useRef(window.speechSynthesis)
  const Navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await axios.get(`${ServerUrl}/api/auth/Logout`, { withCredentials: true })
      SetUserData(null)
      Navigate("/Signup")
      toast.success("Logout Successfully")
    } catch (error) {
      console.error("error in handlelogout", error)
      SetUserData(null)
      toast.error("Failed to logout")
    }
  }

  // Safe start with guard & small delay to avoid InvalidStateError
  const startRecognition = async () => {
    const recognition = recognitionRef.current
    if (!recognition) return
    if (isRecognizingRef.current || isSpeakingRef.current) return

    try {
      // small delay to avoid conflicts with previous stop/start
      await new Promise(r => setTimeout(r, 120))
      recognition.start()
      // onstart handler will flip flags
    } catch (err) {
      // ignore common InvalidStateError; log others
      if (err && err.name !== "InvalidStateError") {
        console.error("Recognition start failed:", err)
      }
    }
  }

  const stopRecognition = () => {
    try {
      const recognition = recognitionRef.current
      if (recognition && isRecognizingRef.current) {
        recognition.stop()
      }
    } catch (err) {
      // ignore stop errors
      console.warn("Recognition stop error", err)
    } finally {
      isRecognizingRef.current = false
      setListening(false)
    }
  }

  const speak = (text) => {
    if (!text) return
    const synth = synthRef.current
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'hi-IN' // keep as you had

    const setVoiceAndSpeak = () => {
      const voices = synth.getVoices()
      const hindiVoice = voices.find(v => v.lang === 'hi-IN') || voices[0]
      if (hindiVoice) utterance.voice = hindiVoice

      isSpeakingRef.current = true
      synth.speak(utterance)

      utterance.onend = () => {
        isSpeakingRef.current = false
        // clear assistant text after speech
        setAiText("")
        // restart recognition after a short pause
        setTimeout(() => {
          if (mountedRef.current) startRecognition()
        }, 600)
      }

      utterance.onerror = (e) => {
        console.error("SpeechSynthesis error:", e)
        isSpeakingRef.current = false
        setTimeout(() => {
          if (mountedRef.current) startRecognition()
        }, 600)
      }
    }

    if (synth.getVoices().length === 0) {
      synth.onvoiceschanged = setVoiceAndSpeak
    } else {
      setVoiceAndSpeak()
    }
  }

  const handleCommand = (data) => {
    if (!data) return
    const { type, userInput, response } = data

    // speak first (will restart recognition on utterance end)
    speak(response)

    // do actions (open tabs, etc.)
    if (type === 'google_search') {
      const q = encodeURIComponent(userInput)
      window.open(`https://www.google.com/search?q=${q}`, '_blank')
    }
    if (type === 'calculator_open') {
      window.open('https://www.google.com/search?q=calculator', '_blank')
    }
    if (type === 'instagram_open') {
      window.open('https://www.instagram.com/', '_blank')
    }
    if (type === 'facebook_open') {
      window.open('https://www.facebook.com/', '_blank')
    }
    if (type === 'weather_show') {
      window.open('https://www.google.com/search?q=weather', '_blank')
    }
    if (['youtube_search', 'youtube_play', 'youtube_open'].includes(type)) {
      const q = encodeURIComponent(userInput)
      window.open(`https://www.youtube.com/results?search_query=${q}&autoplay=1`, '_blank')
    }
    if (type === 'open_to_do' || type === 'open_to_do_list') {
      window.open('https://app.todoist.com/app/inbox', '_blank')
    }
    if (type === 'open_chatgpt') {
      window.open('https://chat.openai.com', '_blank') // more reliable url
    }
  }

  useEffect(() => {
    mountedRef.current = true
    // create recognition once
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      console.error("Browser does not support SpeechRecognition")
      return
    }

    const recognition = new SpeechRecognition()
    recognition.continuous = true
    recognition.lang = 'en-US'
    recognition.interimResults = false

    recognitionRef.current = recognition

    // start after short delay unless we're speaking
    const tryStartTimeout = setTimeout(() => {
      if (mountedRef.current && !isSpeakingRef.current && !isRecognizingRef.current) {
        startRecognition()
      }
    }, 800)

    recognition.onstart = () => {
      isRecognizingRef.current = true
      setListening(true)
    }

    recognition.onend = () => {
      isRecognizingRef.current = false
      setListening(false)
      // try restart only when not speaking
      if (mountedRef.current && !isSpeakingRef.current) {
        setTimeout(() => {
          if (mountedRef.current) startRecognition()
        }, 700)
      }
    }

    recognition.onerror = (event) => {
      console.warn("Recognition error", event.error)
      isRecognizingRef.current = false
      setListening(false)
      // on some errors try to restart after a delay
      setTimeout(() => {
        if (mountedRef.current && !isSpeakingRef.current) startRecognition()
      }, 1200)
    }

    recognition.onresult = async (e) => {
      // get the last final transcript
      const last = e.results[e.results.length - 1]
      const transcript = last[0].transcript.trim()
      // check for assistant name trigger (case-insensitive)
      if (transcript.toLowerCase().includes((UserData?.AssistantName || "").toLowerCase())) {
        // take control: stop recognition before processing
        stopRecognition()
        setUserText(transcript)
        setAiText("")

        try {
          // guard against errors from API
          const data = await getGeminiResponse(transcript)
          if (data) {
            // speak + perform commands
            handleCommand(data)
            // show AI response text in UI until speaking finishes
            setAiText(data.response)
          } else {
            // fallback message
            speak("Sorry, I couldn't get a response.")
          }
        } catch (err) {
          console.error("Error getting Gemini response:", err)
          speak("There was an error processing your request.")
        } finally {
          // clear user text in UI
          setUserText("")
          // ensure recognition restarts (speak will also restart on its onend; this is just backup)
          setTimeout(() => {
            if (mountedRef.current && !isRecognizingRef.current && !isSpeakingRef.current) {
              startRecognition()
            }
          }, 1100)
        }
      }
    }

    // initial greeting -> use a single, robust flow
    const greetUser = () => {
      const greeting = new SpeechSynthesisUtterance(`Hello ${UserData?.name || ""}, How can I help you?`)
      greeting.lang = 'hi-IN'
      greeting.onend = () => {
        // start recognition after greeting ends
        setTimeout(() => {
          if (mountedRef.current) startRecognition()
        }, 400)
      }
      synthRef.current.speak(greeting)
    }

    // greet once voices are loaded
    if (synthRef.current.getVoices().length === 0) {
      synthRef.current.onvoiceschanged = greetUser
    } else {
      greetUser()
    }

    return () => {
      mountedRef.current = false
      clearTimeout(tryStartTimeout)
      stopRecognition()
      // remove handlers
      if (recognitionRef.current) {
        recognitionRef.current.onresult = null
        recognitionRef.current.onend = null
        recognitionRef.current.onerror = null
        recognitionRef.current.onstart = null
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="relative w-full h-screen overflow-hidden flex justify-center items-center flex-col gap-[15px] bg-gradient-to-t from-black to-[#02023d]">
      <AiOutlineMenu
        className="lg:hidden text-white absolute top-[20px] right-[20px] w-[25px] h-[25px] z-10"
        onClick={() => setHam(true)}
      />

      <div
        className={`absolute top-0 w-full h-full bg-[#00000018] backdrop-blur-lg p-[20px] flex flex-col gap-[20px] items-start lg:hidden z-10 ${Ham ? "translate-x-0" : "translate-x-full"} transition-transform`}
      >
        <RxCross1
          className="text-white absolute top-[20px] right-[20px] w-[25px] h-[25px]"
          onClick={() => setHam(false)}
        />

        <button className="min-w-[150px] h-[60px] text-black font-semibold bg-white rounded-full text-[19px] cursor-pointer" onClick={handleLogout}>Logout</button>

        <button className="min-w-[150px] h-[60px] text-black font-semibold bg-white rounded-full text-[19px] px-[20px] py-[10px] cursor-pointer" onClick={() => Navigate("/Customize")}>Customize Assistant</button>

        <div className="w-full h-[2px] bg-gray-400"></div>
        <h1 className="text-white text-[19px] font-semibold">History</h1>
        <div className="w-full h-[60%] overflow-auto flex flex-col gap-[20px] items-start">
          {UserData?.history?.map((his, idx) => (
            <span key={idx} className="text-gray-400 text-[18px]">{his}</span>
          ))}
        </div>
      </div>

      <button className="min-w-[150px] h-[60px] mt-[30px] text-black font-semibold bg-white rounded-full text-[19px] absolute top-[20px] right-[20px] px-[20px] py-[10px] cursor-pointer hidden lg:block z-10" onClick={handleLogout}>Logout</button>

      <button className="min-w-[150px] h-[60px] mt-[30px] text-black font-semibold bg-white rounded-full text-[19px] absolute top-[100px] right-[20px] px-[20px] py-[10px] cursor-pointer hidden lg:block z-10" onClick={() => Navigate("/Customize")}>Customize Assistant</button>

      <div className="w-[240px] h-[320px] flex justify-center items-center overflow-hidden rounded-4xl shadow-lg z-10">
        <img src={UserData?.AssistantImage} alt="" className="h-full object-cover" />
      </div>

      <h1 className="text-white text-[19px] font-semibold z-10">I'm {UserData?.AssistantName}</h1>

      {AiText ? (
        <img src={userImg} className="w-[120px] h-[80px] opacity-80 mix-blend-screen drop-shadow-lg z-10" />
      ) : (
        <img src={aiImg} className="w-[120px] h-[80px] mix-blend-screen drop-shadow-lg z-10" />
      )}

      <h1 className="text-white font-semibold z-10">
        {UserText ? UserText : AiText ? AiText : null}
      </h1>
    </div>
  )
}

export default Home
