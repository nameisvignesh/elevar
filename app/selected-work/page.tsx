'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Pause, Play, Volume2, VolumeX } from 'lucide-react';
import { withBasePath } from '@/lib/paths';

type VideoItem = {
  id: string;
  src: string;
  poster: string;
  accessibleName: string;
};

const videos: VideoItem[] = [
  {
    id: 'family-friend',
    src: withBasePath('/family-friend.mp4'),
    poster: withBasePath('/logo.svg'),
    accessibleName: 'Family Friend portfolio video',
  },
  {
    id: 'final-out-tiles',
    src: withBasePath('/final-out-tiles.mp4'),
    poster: withBasePath('/logo.svg'),
    accessibleName: 'Final Out Tiles portfolio video',
  },
  {
    id: 'nanotiles',
    src: withBasePath('/nanotiles.mp4'),
    poster: withBasePath('/logo.svg'),
    accessibleName: 'Nano Tiles portfolio video',
  },
  {
    id: 'reel-6-out',
    src: withBasePath('/reel-6-out.mp4'),
    poster: withBasePath('/logo.svg'),
    accessibleName: 'Reel 6 portfolio video',
  },
  {
    id: 'final-out',
    src: withBasePath('/final-out.mp4'),
    poster: withBasePath('/logo.svg'),
    accessibleName: 'Final Out portfolio video',
  },
];

export default function SelectedWorkPage() {
  return (
    <main className="selected-work-page">
      <div className="container">
        <Link href="/" className="back-link">
          <ArrowLeft size={16} aria-hidden="true" />
          Home
        </Link>

        <header className="selected-work-heading">
          <span className="eyebrow">Portfolio</span>
          <h1>Selected work</h1>
          <p>Stories shaped for the people they need to reach.</p>
        </header>

        <section className="video-card-grid" aria-label="Selected work videos">
          {videos.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </section>
      </div>
    </main>
  );
}

function VideoCard({ video }: { video: VideoItem }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const cardRef = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const observer = new IntersectionObserver(
      ([entry]) => setInView(Boolean(entry?.isIntersecting)),
      { rootMargin: '120px 0px', threshold: 0.15 }
    );

    observer.observe(card);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = isMuted;
    if (!inView) {
      video.pause();
      return;
    }

    video.play().catch(() => setIsPlaying(false));
  }, [inView, isMuted]);

  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play().catch(() => setIsPlaying(false));
    } else {
      video.pause();
    }
  }, []);

  const toggleMute = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    const nextMuted = !video.muted;
    video.muted = nextMuted;
    setIsMuted(nextMuted);
    if (video.paused) video.play().catch(() => setIsPlaying(false));
  }, []);

  return (
    <article ref={cardRef} className="video-card">
      <video
        ref={videoRef}
        src={inView ? video.src : undefined}
        poster={video.poster}
        muted={isMuted}
        loop
        playsInline
        preload="metadata"
        aria-label={video.accessibleName}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />
      <div className="video-card-controls" aria-label="Video controls">
        <button
          type="button"
          onClick={togglePlay}
          aria-label={isPlaying ? 'Pause video' : 'Play video'}
        >
          {isPlaying ? <Pause size={17} /> : <Play size={17} />}
        </button>
        <button
          type="button"
          onClick={toggleMute}
          aria-label={isMuted ? 'Unmute video' : 'Mute video'}
          aria-pressed={!isMuted}
        >
          {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>
      </div>
    </article>
  );
}
