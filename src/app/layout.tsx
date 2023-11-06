import { Toaster } from 'sonner';
import '../styles/styles.scss';
import { Inter, Roboto, Lora } from 'next/font/google'

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
  return (
    <html lang="en" className={`${inter.variable} ${roboto.variable} ${lora.variable} bg-white`}>
      <Toaster position='top-right' />
      <body className='font-inter @lo:weight-300 @lo:text-dimgrey'>{children}</body>
    </html>
  )
}
