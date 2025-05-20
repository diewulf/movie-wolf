// components/Header.js
import Link from 'next/link';
import SearchInput from '../search';

const Header = () => {
  return (
    <header className="sticky top-0 z-10 w-full bg-background border-b">
      <div className="container mx-auto px-4 py-3 flex items-center">
        <Link href="/" className="mr-6 font-bold text-xl">
          Filmoteca
        </Link>
        <div className="relative flex-1 max-w-sm">
          <SearchInput onSearch={() => {}} />
        </div>
      </div>
    </header>
  );
};

export default Header;
