'use client';
import Link from 'next/link';
import SearchInput from '../search';
import Image from 'next/image';

const mockMovies = [
  { id: 1, title: 'El Padrino', filePath: '/films/padrino.mp4' },
  { id: 2, title: 'La Matrix', filePath: '/films/matrix.mp4' },
  { id: 3, title: 'Interestelar', filePath: '/films/interestelar.mp4' },
  { id: 4, title: 'Wolf Cinema', filePath: '/films/wolf.mp4' },
];

const Header = () => {
  return (
    <header className="sticky top-0 z-10 w-full bg-background border-b shadow-sm">
      <div className="container mx-auto px-4 py-3 flex items-center">
        <Link href="/" className="mr-6 font-bold text-xl hidden sm:block">
          <Image src="/logo.png" alt="Logo" width={120} height={42} />
        </Link>
        <div className="relative flex-1 max-w-sm">
          <SearchInput movies={mockMovies} />
        </div>
      </div>
    </header>
  );
};

export default Header;
