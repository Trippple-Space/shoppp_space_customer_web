// "use client"

import '../styles/styles.scss';
import {
  Inter,
  Roboto,
  Lora,
  Roboto_Mono,
  DM_Sans,
  Volkhov,
  Poppins,
  Young_Serif,
} from 'next/font/google';
// import { useAuthGuard } from '@/modules/lib/utility/hooks/use-auth-guard';
import GlobalArena from '@/modules/lib/components/global-arena/GlobalArena';
import GlobalLaunchBanner from '@/modules/lib/components/global-launch-banner/GlobalLaunchBanner';
import { PHProvider } from './providers';
import dynamic from 'next/dynamic';
import '@smastrom/react-rating/style.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dmSans',
  display: 'swap',
});

const volkhov = Volkhov({
  subsets: ['latin'],
  variable: '--font-volkhov',
  display: 'swap',
  weight: ['400', '700'],
});

const poppins = Poppins({
  subsets: ['latin'],
  variable: '--font-poppins',
  display: 'swap',
  weight: ['100', '300', '400', '500', '700', '900'],
});

const youngSerif = Young_Serif({
  subsets: ['latin'],
  variable: '--font-youngSerif',
  display: 'swap',
  weight: ['400'],
});

const roboto = Roboto({
  subsets: ['latin'],
  variable: '--font-roboto',
  display: 'swap',
  weight: ['100', '300', '400', '500', '700', '900'],
});

const lora = Lora({
  subsets: ['latin'],
  variable: '--font-lora',
  display: 'swap',
});

const robotoMono = Roboto_Mono({
  subsets: ['latin'],
  variable: '--font-robotoMono',
  display: 'swap',
  weight: ['100', '300', '400', '500', '700'],
});

export const metadata = {
  title: 'Asoebi Africa',
  description: 'Fashion commerce with the vibe 😎',
};

export interface ILayout {
  children: React.ReactNode;
}

const PostHogPageView = dynamic(() => import('./PostHogPageView'), {
  ssr: false,
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // useAuthGuard()

  return (
    <html
      lang="en"
      className={`${inter.variable} ${roboto.variable} ${lora.variable} ${robotoMono.variable} ${dmSans.variable} ${volkhov.variable} ${poppins.variable} ${youngSerif.variable} bg-white font-inter h-full`}
    >
      <body className="@lo:weight-300 @lo:text-dimgrey h-full">
        <PHProvider>
          <PostHogPageView />
          <GlobalArena />
          <GlobalLaunchBanner />
          {/* <div className="fixed w-full b-60 z-3">
            <div className="max-w-1000 mx-auto flex text-14 l:text-16 bg-yellow-50 text-green p-10 max-w-1100 mx-auto ">
              <BsInfoCircle className="inline-block w-fit text-26 mr-10 mt--2" />
              <span>
                This site is currently in test mode. No real purchases can be made
                yet. However, we would appreciate your efforts to make this
                product better. Missing a feature you would like? Or noticed
                something not working? Kindly shoot us a mail at{" "}
                <a className="bold underline" href="mailto:support@asoebi.africa">
                  support@asoebi.africa
                </a>
              </span>
            </div>
          </div> */}
          {children}
        </PHProvider>
      </body>
    </html>
  );
}
