// "use client"

import { Toaster } from 'sonner';
import '../styles/styles.scss';
import { Inter, Roboto, Lora } from 'next/font/google'
// import { useAuthGuard } from '@/modules/lib/utility/hooks/use-auth-guard';
import GlobalArena from '@/modules/lib/components/global-arena/GlobalArena';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const roboto = Roboto({
  subsets: ['latin'],
  variable: '--font-roboto',
  display: 'swap',
  weight: ['100', '300', '400', '500', '700', '900']
});

const lora = Lora({
  subsets: ['latin'],
  variable: '--font-lora',
  display: 'swap',
});

export const metadata = {
  title: 'Asoebi Africa',
  description: 'Fabrics touche',
}

export interface ILayout {
  children: React.ReactNode
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  // useAuthGuard()

  return (
    <html lang="en" className={`${inter.variable} ${roboto.variable} ${lora.variable} bg-white font-inter`}>
      <GlobalArena />
      <body className='@lo:weight-300 @lo:text-dimgrey'>
        <div className='fixed w-full bg-yellow-50 text-green p-10 b-50 z-50'>
          <div className='max-w-1000 mx-auto text-14 l:text-16'>
          This site is currently in test mode. No real purchases can be made yet.
          However, we would appreciate your efforts to make this product better. 
          Missing a feature you would like? Or noticed something not working? Kindly shoot us a mail at <a className='bold underline' href="mailto:support@asoebi.africa">support@asoebi.africa</a>
          </div>
        </div>
        {children}
      </body>
    </html>
  )
}
