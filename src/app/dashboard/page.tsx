'use client';
import Link from 'next/link'; // Componente de Next.js para navegación
import Image from 'next/image'; // Componente de Next.js para optimización de imágenes
import { MOVIES } from './movie-list';

// Datos de ejemplo para las películas

// Este es un Server Component de Next.js por defecto
export default function Home() {
  return (
    <>
      <h1 className="text-2xl font-bold mb-6">Películas Populares</h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {MOVIES.map((movie) => (
          <Link
            key={movie.id}
            href={`./dashboard/movie/${movie.id}`} // Enrutamiento dinámico de Next.js
            className="group rounded-lg overflow-hidden border bg-card shadow-sm transition-all hover:shadow-md"
          >
            <div className="aspect-[2/3] relative">
              <Image
                src={movie.image}
                alt={movie.title}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-3">
              <h2 className="font-medium line-clamp-1 group-hover:text-primary transition-colors">
                {movie.title}
              </h2>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
