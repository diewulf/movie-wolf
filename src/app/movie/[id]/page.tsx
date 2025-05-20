'use client';
import Link from 'next/link'; // Componente de Next.js para navegación
import Image from 'next/image'; // Componente de Next.js para optimización de imágenes

import Header from '@/app/components/layout/header';

// Datos de ejemplo para las películas
const movies = [
  {
    id: '1',
    title: 'Inception',
    image: '/placeholder.svg?height=400&width=300',
    description:
      'Un ladrón que roba secretos corporativos a través del uso de la tecnología de compartir sueños, se le da la tarea inversa de plantar una idea en la mente de un CEO.',
    videoUrl:
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  },
  {
    id: '2',
    title: 'The Dark Knight',
    image: '/placeholder.svg?height=400&width=300',
    description:
      'Cuando la amenaza conocida como el Joker causa estragos y caos en Gotham City, Batman debe aceptar una de las mayores pruebas psicológicas y físicas para luchar contra la injusticia.',
    videoUrl:
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
  },
  {
    id: '3',
    title: 'Interstellar',
    image: '/placeholder.svg?height=400&width=300',
    description:
      'Un equipo de exploradores viaja a través de un agujero de gusano en el espacio en un intento de garantizar la supervivencia de la humanidad.',
    videoUrl:
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
  },
  {
    id: '4',
    title: 'Pulp Fiction',
    image: '/placeholder.svg?height=400&width=300',
    description:
      'Las vidas de dos sicarios, un boxeador, la esposa de un gángster y un par de bandidos se entrelazan en cuatro historias de violencia y redención.',
    videoUrl:
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
  },
  {
    id: '5',
    title: 'The Godfather',
    image: '/placeholder.svg?height=400&width=300',
    description:
      'El patriarca de una dinastía del crimen organizado transfiere el control de su imperio clandestino a su reacio hijo.',
    videoUrl:
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
  },
  {
    id: '6',
    title: 'Fight Club',
    image: '/placeholder.svg?height=400&width=300',
    description:
      'Un oficinista insomne y un fabricante de jabones forman un club de lucha clandestino que evoluciona en algo mucho más peligroso.',
    videoUrl:
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
  },
];

// Este es un Server Component de Next.js que recibe parámetros de ruta
export default function MoviePage({ params }: { params: { id: string } }) {
  // Buscar la película por ID
  const movie = movies.find((m) => m.id === params.id) || movies[0];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Topbar con buscador */}
      <Header />

      {/* Contenedor principal con reproductor de video */}
      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="mb-4">
          <Link href="/" className="text-primary hover:underline">
            ← Volver a películas
          </Link>
        </div>

        <h1 className="text-2xl font-bold mb-4">{movie.title}</h1>

        <div className="aspect-video w-full bg-black rounded-lg overflow-hidden mb-6">
          <video
            src={'/films/dark-city.mp4'}
            controls
            className="w-full h-full"
            poster={movie.image}
          />
        </div>

        <div className="grid md:grid-cols-[300px_1fr] gap-6">
          <div className="aspect-[2/3] relative rounded-lg overflow-hidden hidden md:block">
            <Image
              src={movie.image || '/placeholder.svg'}
              alt={movie.title}
              fill
              className="object-cover"
            />
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-2">Descripción</h2>
            <p className="text-muted-foreground">{movie.description}</p>
          </div>
        </div>
      </main>
    </div>
  );
}
