import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Asoebi Africa - Contact Us Form',
  description:
    'Get in touch with Asoebi Africa for inquiries, support, or feedback through our Contact Us page.',
};

export default function ContactUsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="h-full font-inter">
      <header className="absolute z-15 l-12 mt-10">
        <Link
          href="/"
          className="w-fit h-fit cursor-pointer"
        >
          <Image
            src="/images/logos/Main logo green.svg"
            alt="asoebi logo"
            className="object-scale-down"
            width={124}
            height={24}
          />
        </Link>
      </header>
      <main className="h-full">{children}</main>
    </div>
  );
}
