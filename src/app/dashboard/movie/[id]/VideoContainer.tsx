'use client';

import VideoPlayer from '@/components/ui/Video';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { MOVIES } from '../../movie-list';

// Datos de ejemplo para las películas

interface Props {
  movieId: string;
}

export function VideoContainer({ movieId }: Props) {
  // Buscar la filmer por ID
  const movie = MOVIES.find((movie) => movie.id === movieId);

  return (
    <>
      <div className="mb-4">
        <Link href="/dashboard" className="text-primary hover:underline">
          ← Volver a películas
        </Link>
      </div>

      <h1 className="text-2xl font-bold mb-4">{movie?.title}</h1>

      <div className="aspect-video w-full bg-black rounded-lg overflow-hidden mb-6">
        <VideoPlayer
          videoSrc={movie.path}
          poster={movie.image}
          tracks={[
            {
              src: movie.vtt,
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
