'use client';
import Link from 'next/link'; // Componente de Next.js para navegación
import Image from 'next/image'; // Componente de Next.js para optimización de imágenes

// Datos de ejemplo para las películas
const movies = [
  {
    id: '1',
    title: 'Inception',
    image: '/films/dark-city.webp?height=400&width=300',
  },
  {
    id: '2',
    title: 'The Dark Knight',
    image: '/films/dark-city.webp?height=400&width=300',
  },
  {
    id: '3',
    title: 'Interstellar',
    image: '/films/dark-city.webp?height=400&width=300',
  },
  {
    id: '4',
    title: 'Pulp Fiction',
    image: '/films/dark-city.webp?height=400&width=300',
  },
  {
    id: '5',
    title: 'The Godfather',
    image: '/films/dark-city.webp?height=400&width=300',
  },
  {
    id: '6',
    title: 'Fight Club',
    image: '/films/dark-city.webp?height=400&width=300',
  },
];

// Este es un Server Component de Next.js por defecto
export default function Home() {
  return (
    <>
      <h1 className="text-2xl font-bold mb-6">Películas Populares</h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {movies.map((movie) => (
          <Link
            key={movie.id}
            href={`/movie/${movie.id}`} // Enrutamiento dinámico de Next.js
            className="group rounded-lg overflow-hidden border bg-card shadow-sm transition-all hover:shadow-md"
          >
            <div className="aspect-[2/3] relative">
              <Image
                src={movie.image || '/dark-city.webp'}
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
