'use client';

import Link from 'next/link';
import Image from 'next/image';
import { LogOut } from 'lucide-react';
import useLogout from '@/hooks/useAuth';

const Header = ({ children }: { children?: React.ReactNode }) => {
  const { logout } = useLogout();

  return (
    <header className="sticky top-0 z-10 w-full bg-background border-b shadow-sm">
      <div className="container gap-2 mx-auto px-4 py-3 flex items-center">
        <Link href="/dashboard" className="font-bold text-xl hidden sm:block">
          <Image src="/logo.png" alt="Logo" width={120} height={42} />
        </Link>

        <div className="relative flex-1">{children}</div>

        <button
          onClick={logout}
          className="flex cursor-pointer items-center text-sm bg-red-600 text-white px-4 py-2 rounded-full hover:bg-red-700 transition"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};

export default Header;
