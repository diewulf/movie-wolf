'use client';
import Link from 'next/link'; // Componente de Next.js para navegación
import Image from 'next/image'; // Componente de Next.js para optimización de imágenes
import SearchInput from './components/search';
import Header from './components/layout/header';

// Datos de ejemplo para las películas
const movies = [
  {
    id: '1',
    title: 'Inception',
    image: '/placeholder.svg?height=400&width=300',
  },
  {
    id: '2',
    title: 'The Dark Knight',
    image: '/placeholder.svg?height=400&width=300',
  },
  {
    id: '3',
    title: 'Interstellar',
    image: '/placeholder.svg?height=400&width=300',
  },
  {
    id: '4',
    title: 'Pulp Fiction',
    image: '/placeholder.svg?height=400&width=300',
  },
  {
    id: '5',
    title: 'The Godfather',
    image: '/placeholder.svg?height=400&width=300',
  },
  {
    id: '6',
    title: 'Fight Club',
    image: '/placeholder.svg?height=400&width=300',
  },
];

// Este es un Server Component de Next.js por defecto
export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Topbar con buscador */}
      <Header />

      {/* Contenedor principal con películas */}
      <main className="flex-1 container mx-auto px-4 py-6">
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
                  src={movie.image || '/placeholder.svg'}
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
      </main>
    </div>
  );
}
