import classNames from 'classnames'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'
import { paths } from '../../utility/paths'

const AuthHeader = ({ activeTab }: { activeTab: string }) => {
    const router = useRouter()
    const [active, setActive] = React.useState(activeTab)

  
  useEffect(() => {
    if (activeTab === 'create-password' || activeTab === 'verify') {
      setActive('signup')
    } else {
      setActive(activeTab)
    }
  }, [activeTab])

  return (
      <>
          <div className='mb-[30px]'>
               <div className='w-full h-full flex items-center flex-col  lg:gap-[30px] '>
                     <div className='w-full flex flex-col gap-[50px]'>
                       <div className='flex items-center lg:gap-[10px] bg-[#F5F5F5] p-[5px] rounded-[6px] '>
                         <div
                           className={classNames('w-full rounded-[6px] cursor-pointer p-[10px] font-normal', {
                             'bg-white': active === 'signup'
                           })}
                           onClick={() => {
                                setActive?.('signup');
                                router.push(paths.signup);
                              }}
                         >
                           <p
                             className={classNames('text-center font-inter text-bold text-[16px]', {
                               'font-semibold': activeTab === 'signup'
                             })}
                           >
                             Sign up
                           </p>
                         </div>
             
                         <div
                           className={classNames(
                             'w-full cursor-pointer cursor-pointer p-[10px] rounded-[6px] font-normal',
                             {
                               'bg-white': active === 'login'
                             }
                           )}
                              onClick={() => {
                                setActive?.('login');
                                router.push(paths.login);
                              }}
                         >
                           <p
                             className={classNames('text-center font-inter text-[16px]', {
                               'font-semibold': activeTab === 'login'
                             })}
                           >
                             Login
                           </p>
                         </div>
                       </div>
                     </div>
                   </div>
      </div>
      </>
  )
}

export default AuthHeader