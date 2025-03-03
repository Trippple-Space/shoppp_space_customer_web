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
          <div className='mb-30'>
               <div className='w-full h-full flex a-items-center flex-col  l:gap-30 '>
                     <div className='w-100p flex flex-col gap-50'>
                       <div className='flex a-items-center l:gap-10 bg-#F5F5F5 p-5 radius-6 '>
                         <div
                           className={classNames('w-100p radius-6 cursor-pointer p-10 weight-400', {
                             'bg-white': active === 'signup'
                           })}
                           onClick={() => {
                                setActive?.('signup');
                                router.push(paths.signup);
                              }}
                         >
                           <p
                             className={classNames('text-center font-inter text-bold text-16', {
                               'weight-600': activeTab === 'signup'
                             })}
                           >
                             Sign up
                           </p>
                         </div>
             
                         <div
                           className={classNames(
                             'w-100p cursor-pointer cursor-pointer p-10 radius-6 weight-400',
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
                             className={classNames('text-center font-inter text-16', {
                               'weight-600': activeTab === 'login'
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