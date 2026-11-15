import Link from 'next/link';

const Footer = () => (
  <footer className="mt-[64px] border-t border-border bg-ground text-ink">
    <div className="app-width flex max-w-[1200px] flex-col gap-[16px] py-[32px] text-[14px] text-muted sm:flex-row sm:items-center sm:justify-between">
      <Link href="/" className="text-[18px] font-bold text-brand">
        Shoppp Space
      </Link>
      <div className="flex flex-wrap gap-[20px]">
        <Link href="/contact-us" className="hover:text-brand">
          Contact
        </Link>
        <Link href="/legal-document" className="hover:text-brand">
          Legal
        </Link>
        <Link href="/auth/login" className="hover:text-brand">
          Log in
        </Link>
      </div>
      <span>© {new Date().getFullYear()} Shoppp Space</span>
    </div>
  </footer>
);

export default Footer;
