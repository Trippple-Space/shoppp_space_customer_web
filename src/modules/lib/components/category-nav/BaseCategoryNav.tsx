import React, { ReactNode, FC, useState } from 'react'
import { TfiAngleRight } from 'react-icons/tfi'
import { LuSettings2 } from 'react-icons/lu'
import Icon from '../icon/Icon'
import cx from 'classnames'

export interface ICategoryNavOption {
    label: string,
    iconSrc: string,
    padding?: string 
}

interface IBaseCategoryNav {
    options: ICategoryNavOption[]
}

const BaseCategoryNav: FC<IBaseCategoryNav> = ({ options }) => {
    const [activeOption, setActiveOption] = useState(0)
    return (
        <div className="flex">
            <div className='scroll-x no-scrollbar w-full'>
                <div className='flex gap-30 h-fit '>
                    {
                        options.map((option, i) => (
                            <div onClick={() => setActiveOption(i)} className="inline-flex min-w-62 pointer flex-col w-fit h-fit text-center">
                                <div className={cx(
                                    "w-35 h-35 mx-auto hover:border hover:border-grey radius-5 overflow-hidden",
                                    {
                                        "border border-green hover:border-green": i == activeOption,
                                        "border": option.padding 
                                    }
                                )} style={{padding: option.padding}}>
                                    <Icon width={45} height={45} className='w-full h-full' ext='' name={option.iconSrc} />
                                </div>
                                <div className={cx("text-14 mt-10 mb-10", {
                                    'text-green': i == activeOption
                                })}>{option.label}</div>
                                { <div className={cx("w-full h-2 radius-4", {
                                    'bg-green': i == activeOption
                                })}></div>}
                            </div>
                        ))
                    }
                </div>          
            </div>
            <div className='flex items-center'>
                <div className="p-13 round bg-white g|margin-top:-30px;margin-left:-7px; g|box-shadow:-27px|_|0px|_|40px|_|0px|_|rgb(275,275,275,0.95);"
                >
                    <button className='bg-white pointer border border-lightgrey round p-7 w-35 h-35 '>
                        <TfiAngleRight className='w-full h-full' />
                    </button>
                </div>  
                <button className='w-119 h-50 pointer g|margin-top:-30px; ml-7 bg-white text-16 text-grey weight-300 radius-10 border border-lightgrey'>
                    <div className='flex w-fit gap-10 mx-auto'>
                        <span> <LuSettings2 /> </span>
                        <span>Filter</span>                    
                    </div>
                </button>              
            </div>

        </div>

    )
}

export default BaseCategoryNav
