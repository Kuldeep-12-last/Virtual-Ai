import React, { useState, useContext } from 'react';
import bg from "../assets/image3.png";      
import toast from 'react-hot-toast';
import { IoIosEye, IoIosEyeOff } from "react-icons/io";  
import { useNavigate } from 'react-router-dom'; 
import axios from 'axios';
import { UserDataContext } from '../context/UserContext';

function Signin() {     
  const [ShowPassword, SetShowPassword] = useState(false);   
  const [Loading, SetLoading] = useState(false);     
  const { ServerUrl, SetUserData } = useContext(UserDataContext);   
  const [ERR, SetError] = useState("");
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });    

  const navigate = useNavigate();

  const HandleSignin = async (event) => {  
    event.preventDefault();  
    SetError("");   
    SetLoading(true);

    try {
      const result = await axios.post(`${ServerUrl}/api/auth/Signin`, formData, { withCredentials: true });
      console.log("backend data", result);  

      SetUserData(result.data.user);   
      toast.success('Signed in successfully!');
      navigate("/");

    } catch (err) {
      console.log(err);     
      toast.error('Signin failed!');
      SetError(err.response?.data?.message || "Something went wrong");   
      SetUserData(null);
    } finally {
      SetLoading(false);
    }
  };

  const handleChange = (event) => {
    setFormData((prevData) => ({
      ...prevData,
      [event.target.name]: event.target.value
    }));
  };

  return (   
    <div
      className="min-h-screen w-full bg-cover bg-center flex justify-center items-center p-4"
      style={{ backgroundImage: `url(${bg})` }}
    >      
      <form  
        onSubmit={HandleSignin} 
        className="
          w-full max-w-md 
          bg-[#6a585843] backdrop-blur-md shadow-lg shadow-green-600 
          flex flex-col justify-center items-center gap-5 
          p-6 sm:p-8 rounded-2xl
        "
      >  
        <h1 className="text-white text-xl sm:text-2xl font-semibold text-center">
          Sign in to <span className="text-blue-700 text-2xl sm:text-3xl font-semibold">Virtual Assistant</span>
        </h1>     

        <input 
          type="email" 
          placeholder="Enter your email" 
          onChange={handleChange} 
          name="email" 
          value={formData.email}  
          className="
            w-full h-12 sm:h-14 outline-none border-2 border-white 
            bg-transparent text-white placeholder-gray-300 
            px-4 rounded-full text-base sm:text-lg
          "
        />   

        <div className="w-full relative h-12 sm:h-14 border-2 border-white bg-transparent text-white rounded-full">
          <input 
            type={ShowPassword ? "text" : "password"} 
            placeholder="Password" 
            onChange={handleChange} 
            name="password" 
            value={formData.password} 
            className="w-full h-full rounded-full outline-none bg-transparent placeholder-gray-300 px-4 text-base sm:text-lg" 
          />   
          {!ShowPassword ? (
            <IoIosEye 
              onClick={() => SetShowPassword(true)} 
              className="absolute top-3 sm:top-4 right-4 text-white text-xl sm:text-2xl cursor-pointer" 
            /> 
          ) : (
            <IoIosEyeOff 
              onClick={() => SetShowPassword(false)} 
              className="absolute top-3 sm:top-4 right-4 text-white text-xl sm:text-2xl cursor-pointer" 
            />
          )}
        </div>       

        {ERR && (
          <p className="text-red-600 text-sm sm:text-base text-center">
            *{ERR}
          </p>
        )}

        <button 
          className="
            w-40 sm:w-44 h-12 sm:h-14 mt-4 text-black font-semibold 
            bg-white rounded-full text-base sm:text-lg
          " 
          disabled={Loading}
        >
          {Loading ? "Loading..." : "Sign In"}
        </button>

        <p className="text-white text-sm sm:text-base text-center">
          Want to create an account?{" "}
          <span 
            onClick={() => navigate("/Signup")} 
            className="text-blue-400 cursor-pointer"
          >
            Sign Up
          </span>
        </p>
      </form>
    </div>
  );
}

export default Signin;
