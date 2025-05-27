import React from 'react';

interface SubtitleTrack {
  src: string;
  label: string;
  lang: string;
  default?: boolean;
}

interface VideoPlayerProps {
  videoSrc: string;
  poster?: string;
  tracks?: SubtitleTrack[];
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  videoSrc,
  poster,
  tracks = [],
}) => {
  return (
    <video controls width="100%" poster={poster}>
      <source src={videoSrc} type="video/mp4" />
      {tracks.map((track, idx) => (
        <track
          key={idx}
          kind="subtitles"
          src={track.src}
          label={track.label}
          srcLang={track.lang}
          default={track.default}
        />
      ))}
      Tu navegador no soporta el elemento de video.
    </video>
  );
};

export default VideoPlayer;
