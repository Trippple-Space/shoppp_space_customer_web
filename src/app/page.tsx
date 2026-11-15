import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-ground text-ink">
      <nav className="app-width flex max-w-[1200px] items-center justify-between py-[24px]">
        <Link href="/" className="text-[24px] font-bold text-brand">
          Shoppp Space
        </Link>
        <Link href="/auth/login" className="font-medium text-brand hover:text-brand-hover">
          Log in
        </Link>
      </nav>

      <section className="app-width flex max-w-[1200px] flex-col items-start py-[96px] lg:py-[144px]">
        <p className="mb-[16px] text-[14px] font-semibold uppercase tracking-[0.18em] text-brand">
          Your commerce space
        </p>
        <h1 className="max-w-[760px] text-[52px] leading-[1.05] font-bold tracking-[-0.04em] lg:text-[76px]">
          Shoppp Space
        </h1>
        <p className="mt-[24px] max-w-[620px] text-[20px] leading-[1.6] text-muted">
          A focused storefront for independent businesses to showcase products,
          reach customers, and grow online.
        </p>
        <div className="mt-[36px] flex flex-wrap gap-[12px]">
          <Link href="/auth/signup" className="btn btn-primary btn-lg font-semibold">
            Get started
          </Link>
          <Link
            href="/auth/login"
            className="rounded-[8px] border border-brand px-[24px] py-[14px] font-semibold text-brand transition-colors hover:bg-brand-tint"
          >
            Log in
          </Link>
        </div>
      </section>

      <section className="border-y border-border bg-brand-tint">
        <div className="app-width max-w-[1200px] py-[80px]">
          <p className="text-[14px] font-semibold uppercase tracking-[0.18em] text-brand">
            Pricing
          </p>
          <h2 className="mt-[12px] text-[36px] font-bold">Simple plans are coming soon.</h2>
          <p className="mt-[16px] max-w-[560px] text-[18px] leading-[1.6] text-muted">
            We are shaping transparent pricing for businesses at every stage.
            Join Shoppp Space now and be first to hear the details.
          </p>
        </div>
      </section>

      <footer className="app-width flex max-w-[1200px] items-center justify-between py-[32px] text-[14px] text-muted">
        <span>© {new Date().getFullYear()} Shoppp Space</span>
        <Link href="/auth/login" className="text-brand hover:text-brand-hover">
          Customer login
        </Link>
      </footer>
    </main>
  );
}
