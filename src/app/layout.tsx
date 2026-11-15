import './globals.css';
import Script from 'next/script';
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
import CookieConsentBanner from '@/modules/lib/components/cookie-consent-banner/CookieConsentBanner';
import { Suspense } from 'react';
import { PHProvider } from './providers';
import PostHogPageView from './PostHogPageView';
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
  title: 'Shoppp Space',
  description: 'A simple space to discover, sell, and grow.',
};

export interface ILayout {
  children: React.ReactNode;
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // useAuthGuard()

  return (
    <html
      lang="en"
      className={`${inter.variable} ${roboto.variable} ${lora.variable} ${robotoMono.variable} ${dmSans.variable} ${volkhov.variable} ${poppins.variable} ${youngSerif.variable} bg-ground font-inter h-full`}
    >
      <head>
        <Script id="meta-pixel-client" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '2220527635148334');
fbq('track', 'PageView');`}
        </Script>
      </head>
      <body className="h-full bg-ground font-light text-ink">
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: 'none' }}
            src="https://www.facebook.com/tr?id=2220527635148334&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
        <PHProvider>
          <Suspense fallback={null}>
            <PostHogPageView />
          </Suspense>
          <CookieConsentBanner />
          {children}
        </PHProvider>
      </body>
    </html>
  );
}
