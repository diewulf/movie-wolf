'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

type LoginArgs = {
  username: string;
  password: string;
};

const useAuth = () => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const login = async ({ username, password }: LoginArgs) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (res.ok) {
        router.push('/dashboard');
      } else {
        setError('Credenciales inválidas');
      }
    } catch (err) {
      console.error('Login failed', err);
      setError('Error inesperado');
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
      router.push('/login');
    } catch (err) {
      console.error('Logout failed', err);
    }
  };

  return {
    login,
    logout,
    error,
    setError,
    loading,
  };
};

export default useAuth;
