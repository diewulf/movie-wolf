import type React from 'react';
import './../globals.css';
import Header from '@/components/layout/header';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      <div className="flex-1 container mx-auto px-4 py-6">{children}</div>
    </>
  );
}
