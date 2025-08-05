import React, { useContext, useState } from 'react';
import { UserDataContext } from '../context/UserContext';
import axios from 'axios';  
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import { useNavigate } from 'react-router-dom';

function Customize2() {
  const { UserData, BackEndImage, SelectedImage, ServerUrl, SetUserData } = useContext(UserDataContext);
  const [AssistantName, setAssistantName] = useState(UserData?.AssistantName || "");   
  const [ Loading ,setLoading]=useState(false)  
  const Navigate=useNavigate()


  const handleUpdateAssistant = async () => { 
    setLoading(true)
    try {
      const formData = new FormData();
      formData.append("AssistantName", AssistantName);

      if (BackEndImage) {
        formData.append("AssistantImage", BackEndImage);
      } else {
        formData.append("imageUrl", SelectedImage);
      }

      const result = await axios.post(`${ServerUrl}/api/user/update`, formData, {
        withCredentials: true,
      }); 
      setLoading(false)
      console.log("result data=",result)
      SetUserData(result.data); 
      Navigate("/")
    } catch (error) {
      console.error("Update assistant failed:", error); 
      setLoading(false)
    }
  };

  return (
    <div className="w-full h-[100vh] bg-gradient-to-t from-black to-[#040488ac] flex justify-center items-center flex-col p-[20px] gap-[20px] relative">  
    <MdOutlineKeyboardBackspace  className=' absolute left-[30px] top-[30px] text-white  w-[25px] h-[25px] cursor-pointer' 
    onClick={()=>Navigate("/Customize")}/>
      <h1 className='text-white text-[30px] text-center'>
        Enter Your <span className='text-blue-500'>Assistant Name</span>
      </h1>
      <input
        type="text"
        placeholder='eg: Jarvis'
        name="name"
        className='w-full max-w-[600px] h-[60px] outline-none border-2 border-white bg-transparent text-white placeholder-gray-300 px-[20px] py-[10px] rounded-full text-[18px]'
        required
        onChange={(e) => setAssistantName(e.target.value)}
        value={AssistantName}
      />
      {AssistantName && (
        <button
          className='min-w-[300px] h-[60px] mt-[30px] text-black font-semibold bg-white rounded-full text-[19px]'
          onClick={handleUpdateAssistant} disabled={Loading} // ✅ No parentheses here
        >
        { !Loading ? "Create Your Assistant":"..Loading"}
        </button>
      )}
    </div>
  );
}

export default Customize2;
