import React from "react";
import bg from "../assets/image3.png";
import { useNavigate } from "react-router-dom";

function About() {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen w-full bg-cover bg-center flex justify-center items-center p-4"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <div
        className="w-full max-w-3xl bg-[#6a585843] backdrop-blur-md shadow-lg shadow-green-600 
        flex flex-col gap-6 p-6 sm:p-10 rounded-2xl text-white"
      >
        {/* Title */}
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center">
          About Us
        </h1>

        {/* Intro Paragraph */}
        <p className="text-sm sm:text-base md:text-lg text-justify leading-relaxed">
          👋 Hi, I’m <span className="text-blue-400 font-semibold">Kuldeep Singh</span>.  
          This project is designed to act as a  
          <span className="text-blue-400 font-semibold"> Virtual Assistant</span>,  
          helping users carry out tasks like quick calculations, answering queries,  
          and boosting productivity — all in one place.
        </p>

        {/* Mission Paragraph */}
        <p className="text-sm sm:text-base md:text-lg text-justify leading-relaxed">
          My aim is to make technology more accessible with a simple, responsive,  
          and user-friendly interface that adapts seamlessly across devices.  
          The assistant is designed to respond in real time and provide a  
          smooth interaction experience for everyone.
        </p>

        {/* Contact Section */}
        <div className="bg-[#ffffff1a] p-4 sm:p-6 rounded-xl shadow-md text-center flex flex-col gap-3">
          <h2 className="text-lg sm:text-xl md:text-2xl font-semibold">
            📞 Contact Me
          </h2>
          <p className="text-sm sm:text-base md:text-lg">
            Phone:{" "}
            <a
              href="tel:+9185******88"
              className="text-blue-400 font-medium hover:underline"
            >
              +91 851*****88
            </a>
          </p>
          <p className="text-sm sm:text-base md:text-lg">
            Email:{" "}
            <a
              href="mailto:kuldeep.singh@example.com"
              className="text-blue-400 font-medium hover:underline"
            >
              kuldeep.csodiya012@gmail.com
            </a>
          </p>
        </div>

        {/* Button */}
        <div className="flex justify-center">
          <button
            onClick={() => navigate("/")}
            className="px-5 sm:px-6 py-2 sm:py-3 text-black font-semibold bg-white 
            rounded-full text-sm sm:text-base md:text-lg hover:bg-gray-200 transition"
          >
            Back to Signup
          </button>
        </div>
      </div>
    </div>
  );
}

export default About;
