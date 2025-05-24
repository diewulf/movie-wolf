'use client';

import VideoPlayer from '@/components/ui/video';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

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

interface Props {
  movieId: string;
}

export function VideoContainer({ movieId }: Props) {
  // Buscar la filmer por ID
  const movie = movies.find((movie) => movie.id === movieId);

  return (
    <>
      <div className="mb-4">
        <Link href="/" className="text-primary hover:underline">
          ← Volver a películas
        </Link>
      </div>

      <h1 className="text-2xl font-bold mb-4">{movie?.title}</h1>

      <div className="aspect-video w-full bg-black rounded-lg overflow-hidden mb-6">
        <VideoPlayer
          videoSrc="/films/dark-city.mp4"
          poster="/films/dark-city.webp"
          tracks={[
            {
              src: '/films/dark-city.vtt',
              label: 'Español',
              lang: 'es',
              default: true,
            },
          ]}
        />
      </div>

      <div className="grid md:grid-cols-[300px_1fr] gap-6">
        <div className="aspect-[2/3] relative rounded-lg overflow-hidden hidden md:block">
          <Image
            src={movie?.image || '/placeholder.svg'}
            alt={movie?.title || ''}
            fill
            className="object-cover"
          />
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">Descripción papu</h2>
          <p className="text-muted-foreground">descripcion</p>
        </div>
      </div>
    </>
  );
}
