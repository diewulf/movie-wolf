'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

export interface Movie {
  id: string;
  title: string;
  image: string;
  path: string;
  vtt: string;
}

interface Props {
  movies: Movie[];
}

export default function SearchInput({ movies }: Props) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Movie[]>([]);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setResults([]); // Oculta la lista
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    const filtered = movies.filter((movie) =>
      movie.title.toLowerCase().includes(value.toLowerCase()),
    );

    setResults(value ? filtered : []);
  };

  return (
    <div className="w-full  relative">
      <div ref={wrapperRef}>
        <input
          type="text"
          value={query}
          onChange={handleChange}
          placeholder="Buscar película..."
          className="w-full px-4 py-2 border border-border rounded-2xl bg-background text-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
        />

        {results.length > 0 && (
          <ul className="absolute z-20 mt-1 w-full bg-background border border-border rounded-2xl shadow-md text-sm">
            {results.map((movie) => (
              <li key={movie.id}>
                <Link
                  href={`/movie/${movie.id}`}
                  className="block hover:bg-white px-4 py-2 hover:bg-muted hover:text-background rounded-xl transition-colors"
                >
                  {movie.title}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
