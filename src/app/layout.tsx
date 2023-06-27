import '../styles/styles.scss';
import { Inter, Roboto } from 'next/font/google'

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
    <html lang="en" className={`${inter.variable} ${roboto.variable} bg-white`}>
      <body className='font-roboto weight-300 text-dimgrey'>{children}</body>
    </html>
  )
}
