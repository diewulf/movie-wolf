'use client';

import { useEffect, useRef } from 'react';

interface VideoPlayerProps {
  src: string;
  poster?: string;
}

export function VideoPlayer({ src, poster }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Intentar configurar el volumen explícitamente cuando el video está listo
    const video = videoRef.current;
    if (!video) return;

    const handleCanPlay = () => {
      // Asegurarse de que el volumen esté activado
      video.volume = 1.0;
      video.muted = false;

      // Algunos navegadores requieren interacción del usuario antes de reproducir audio
      console.log('Video listo para reproducir. Estado de audio:', {
        muted: video.muted,
        volume: video.volume,
        audioTracks: video.audioTracks
          ? video.audioTracks.length
          : 'no disponible',
      });
    };

    video.addEventListener('canplay', handleCanPlay);

    return () => {
      video.removeEventListener('canplay', handleCanPlay);
    };
  }, []);

  return (
    <div className="relative w-full">
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        controls
        className="w-full h-full"
        preload="metadata"
        controlsList="nodownload"
        playsInline
        onError={(e) => console.error('Error de video:', e.currentTarget.error)}
      />
    </div>
  );
}
