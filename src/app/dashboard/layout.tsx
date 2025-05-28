import type React from 'react';
import './../globals.css';
import Header from '@/components/layout/header';
import SearchInput, { Movie } from '@/components/search';
import { MOVIES } from './movie-list';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header>
        <SearchInput movies={MOVIES as Movie[]} />
      </Header>
      <div className="flex-1 container mx-auto px-4 py-6">{children}</div>
    </>
  );
}
