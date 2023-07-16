import React, { useState } from 'react'
import { LiaAngleUpSolid } from "react-icons/lia";
import { BsDot } from "react-icons/bs";
import cx from 'classnames'

const Footer = () => {

    const [isFooterOpen, setIsFooterOpen] = useState(false)
  return (
    <div className='fixed b-0 l-0 w-full'>
        <div className={cx("w-full h-500 py-55 px-80 grid g|transition:0.5s relative g|transform:translateY(150%); bg-lightgrey", {
            "g|transform:translateY(0);": isFooterOpen
        })}>

        </div>  
        <div onClick={() => setIsFooterOpen((prev) => !prev)} className="flex g|transition:0.5s bg-white relative pointer w-full g|box-shadow:0px|_|-2px|_|10px|_|rgba(0,0,0,0.10); py-13">
            <div className='w-90p mx-auto flex whitespace-nowrap weight-400 text-16 a-self-center'>
                <div className="w-full flex">
                    <div className="w-fit flex mx-auto a-self-center ">
                        <span>@ 2023 asoebi all reserved.</span>
                        <span className='flex w-fit'> <BsDot className='w-20 h-20' /> <span>Let us help you</span> </span>
                        <span className='flex w-fit'> <BsDot className='w-20 h-20' /> <span>Let us help you</span> </span>
                        <span className='flex w-fit'> <BsDot className='w-20 h-20' /> <span>Let us help you</span> </span>
                        <span className='flex w-fit'> <BsDot className='w-20 h-20' /> <span>Let us help you</span> </span>
                    </div>
                </div>
                <span className='w-fit h-fit a-self-center block pointer '>
                    <LiaAngleUpSolid className={cx("w-20 h-20 g|transition:0.5s ", {
                        "rotate-z-180": isFooterOpen
                    })} />
                </span>
            </div>        
        </div>

    </div>


  )
}

export default Footer
