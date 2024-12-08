import { FooterEcommerce } from '@/components/footer-ecommerce';
import { Navbar } from '@/components/navbar';
import { Aside } from '@/components/sidebar';
import React from 'react';

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main>
      <Aside />
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <Navbar />
        {children}
        <FooterEcommerce />
      </div>
    </main>
  );
};

export default RootLayout;
