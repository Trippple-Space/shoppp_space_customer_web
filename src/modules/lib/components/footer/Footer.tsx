import React from 'react'
import { LiaAngleUpSolid } from "react-icons/lia";
import { BsDot } from "react-icons/bs";

const Footer = () => {
  return (
    <div className="fixed g|transition:0.5s bg-white opacity-90 hover:opacity-100 pointer b-0 l-0 w-full g|box-shadow:0px|_|-2px|_|10px|_|rgba(0,0,0,0.10); py-13">
        <div className='w-90p mx-auto flex whitespace-nowrap weight-400 text-16'>
            <div className="w-full">
                <div className="w-fit flex mx-auto ">
                    <span>@ 2023 asoebi all reserved.</span>
                    <span className='flex w-fit'> <BsDot className='w-20 h-20' /> <span>Let us help you</span> </span>
                    <span className='flex w-fit'> <BsDot className='w-20 h-20' /> <span>Let us help you</span> </span>
                    <span className='flex w-fit'> <BsDot className='w-20 h-20' /> <span>Let us help you</span> </span>
                    <span className='flex w-fit'> <BsDot className='w-20 h-20' /> <span>Let us help you</span> </span>
                </div>
            </div>
            <span className='w-fit h-fit a-self-center block pointer '>
                <LiaAngleUpSolid className="w-20 h-20" />
            </span>
        </div>        
    </div>

  )
}

export default Footer
