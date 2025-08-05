import React from 'react'
import { useContext } from 'react'
import { UserDataContext } from '../context/UserContext'

function Card({image}) {   
    const {ServerUrl,UserData,SetUserData,FrontEndImage,
          setFrontEndImage,BackEndImage,setBackEndImage,
          SelectedImage,setSelectedImage} =useContext(UserDataContext)    
          //console.log("From Card context:", { SelectedImage, setSelectedImage });

  return (
    <div
  className={`w-[65px] h-[130px] lg:w-[95px] lg:h-[160px] bg-[#030326]
    border-2 border-[#0000ff66] rounded-2xl overflow-y-hidden cursor-pointer 
    hover:border-4 hover:border-amber-50 hover:shadow-2xl hover:shadow-blue-700
    ${SelectedImage == image 
      ? "border-4 border-amber-50 shadow-2xl shadow-blue-700"
      :null
    }`}
  onClick={()=>{ setSelectedImage(image) 
                  setBackEndImage(null)
                  setFrontEndImage(null)
     }
  }
>
  <img src={image} className="h-full object-cover" />
</div>

  )
}

export default Card
