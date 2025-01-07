// app/products/[slug]/layout.tsx
import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Asoebi Africa - All Products',
  description: 'Explore the best fabrics on Asoebi Africa',
  openGraph: {
    title: 'Asoebi Africa - All Products',
    description: 'Explore the best fabrics on Asoebi Africa',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Asoebi Africa - All Products',
    description: 'Explore the best fabrics on Asoebi Africa',
  },
};

export default function ProductLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <header>Product Header</header>
      <main>{children}</main>
      <footer>Footer</footer>
    </div>
  );
}