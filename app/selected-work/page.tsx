"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Volume2, VolumeX, ArrowLeft, Play, Pause } from "lucide-react";

type VideoItem = {
  id: string;
  title: string;
  src: string;
  poster?: string;
};

const videos: VideoItem[] = [
  {
    id: "video-1",
    title: "Family Friend",
    src: "https://xiniunszguqd8c4n.public.blob.vercel-storage.com/family-friend.mp4",
    poster: "/logo.svg",
  },
  {
    id: "video-2",
    title: "Final Out Tiles",
    src: "https://xiniunszguqd8c4n.public.blob.vercel-storage.com/final-out-tiles.mp4",
    poster: "/logo.svg",
  },
  {
    id: "video-3",
    title: "Nano Tiles",
    src: "https://xiniunszguqd8c4n.public.blob.vercel-storage.com/nanotiles.mp4",
    poster: "/logo.svg",
  },
];

export default function SelectedWorkPage() {
  return (
    <main style={{ minHeight: "100vh", paddingBottom: "80px" }}>
      <div className="container">
        {/* Navigation Back Link */}
        <div style={{ marginBottom: 24, marginTop: 24 }}>
          <Link
            href="/"
            className="btn btn-secondary compact"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <ArrowLeft size={16} />
            Back to Home
          </Link>
        </div>

        {/* Header Section */}
        <div className="selected-head" style={{ marginBottom: 40 }}>
          <div>
            <span className="eyebrow">Portfolio Showcase</span>
            <h1 style={{ fontSize: "2.5rem", fontWeight: 700, margin: "8px 0 12px" }}>
              Selected Work
            </h1>
            <p
              className="muted"
              style={{
                maxWidth: 540,
                fontSize: "1.1rem",
                lineHeight: 1.6,
              }}
            >
              Explore our strategic content engines engineered for retention, authority, and high audience conversion.
            </p>
          </div>
        </div>

        {/* Video Portfolio Grid */}
        <section
          aria-label="Selected work videos"
          className="video-card-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "24px",
          }}
        >
          {videos.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </section>
      </div>
    </main>
  );
}

/* =========================================================
   VIDEO CARD COMPONENT
   ========================================================= */

function VideoCard({ video }: { video: VideoItem }) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [inView, setInView] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [volume, setVolume] = useState(0.8);
  const [isLoading, setIsLoading] = useState(true);

  /* Observer to detect when video card enters viewport */
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        setInView(entry.isIntersecting);
      },
      {
        root: null,
        rootMargin: "150px 0px",
        threshold: 0.15,
      }
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  /* Synchronize autoplay on scroll (MUST start muted per browser policy) */
  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    if (!inView) {
      videoElement.pause();
      setIsPlaying(false);
    } else {
      videoElement.muted = isMuted;
      videoElement
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    }
  }, [inView]);

  /* Direct, synchronous Mute/Unmute handler triggered by user gesture */
  const toggleMute = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    const videoElement = videoRef.current;
    if (!videoElement) return;

    const newMutedState = !videoElement.muted;

    // 1. Direct synchronous modification of DOM properties
    videoElement.muted = newMutedState;
    if (!newMutedState) {
      const activeVolume = volume > 0 ? volume : 0.8;
      videoElement.volume = activeVolume;
      setVolume(activeVolume);
    }

    // 2. React State Sync
    setIsMuted(newMutedState);

    // 3. Guarantee playback resumes upon unmuting
    videoElement
      .play()
      .then(() => setIsPlaying(true))
      .catch((err) => console.warn("Browser blocked sound playback:", err));
  }, [volume]);

  /* Direct Play/Pause Toggle */
  const togglePlay = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    e?.preventDefault();

    const videoElement = videoRef.current;
    if (!videoElement) return;

    if (videoElement.paused) {
      videoElement
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => console.warn("Playback error:", err));
    } else {
      videoElement.pause();
      setIsPlaying(false);
    }
  }, []);

  /* Volume slider adjustment */
  const handleVolumeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();

    const newVolume = Number(e.target.value);
    setVolume(newVolume);

    const videoElement = videoRef.current;
    if (videoElement) {
      videoElement.volume = newVolume;
      const shouldMute = newVolume === 0;
      videoElement.muted = shouldMute;
      setIsMuted(shouldMute);
    }
  }, []);

  return (
    <div
      ref={containerRef}
      className="video-card tilt-card"
      style={{
        position: "relative",
        borderRadius: "16px",
        overflow: "hidden",
        background: "#050505",
        border: "1px solid rgba(255, 255, 255, 0.08)",
        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.4)",
        userSelect: "none",
      }}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          aspectRatio: "3 / 4",
          background: "#000",
          overflow: "hidden",
        }}
      >
        {/* HTML5 Video Element */}
        <video
          ref={videoRef}
          src={inView ? video.src : undefined}
          poster={video.poster}
          muted={isMuted}
          loop
          playsInline
          preload="metadata"
          onLoadedData={() => setIsLoading(false)}
          onWaiting={() => setIsLoading(true)}
          onPlaying={() => {
            setIsLoading(false);
            setIsPlaying(true);
          }}
          onPause={() => setIsPlaying(false)}
          onError={() => {
            setIsLoading(false);
            console.error("Unable to load video source:", video.src);
          }}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
            background: "#000",
            cursor: "pointer",
          }}
          onClick={togglePlay}
        />

        {/* Gradient Overlay for controls visibility */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0) 40%, rgba(0,0,0,0.2) 100%)",
            pointerEvents: "none",
            zIndex: 2,
          }}
        />

        {/* Video Title Overlay */}
        {video.title && (
          <div
            style={{
              position: "absolute",
              top: 16,
              left: 16,
              right: 16,
              zIndex: 10,
              pointerEvents: "none",
            }}
          >
            <h3
              style={{
                color: "#ffffff",
                fontSize: "1rem",
                fontWeight: 600,
                margin: 0,
                textShadow: "0 2px 4px rgba(0,0,0,0.6)",
              }}
            >
              {video.title}
            </h3>
          </div>
        )}

        {/* Loading Spinner */}
        {isLoading && inView && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(0, 0, 0, 0.3)",
              pointerEvents: "none",
              zIndex: 5,
            }}
          >
            <span
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                border: "3px solid rgba(255,255,255,0.2)",
                borderTopColor: "#00b4d8",
                animation: "videoSpinner 0.8s linear infinite",
              }}
            />
          </div>
        )}

        {/* Controls Overlay Bar */}
        <div
          style={{
            position: "absolute",
            left: 12,
            right: 12,
            bottom: 12,
            zIndex: 20,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          {/* Play / Pause Button */}
          <button
            type="button"
            onClick={togglePlay}
            aria-label={isPlaying ? "Pause video" : "Play video"}
            style={{
              width: 38,
              height: 38,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 10,
              border: "1px solid rgba(255,255,255,0.15)",
              background: "rgba(0,0,0,0.75)",
              color: "#fff",
              cursor: "pointer",
              backdropFilter: "blur(10px)",
              transition: "all 0.2s ease",
            }}
          >
            {isPlaying ? <Pause size={17} strokeWidth={2} /> : <Play size={17} strokeWidth={2} />}
          </button>

          {/* Mute / Unmute Button */}
          <button
            type="button"
            onClick={toggleMute}
            aria-label={isMuted ? "Unmute video" : "Mute video"}
            aria-pressed={!isMuted}
            style={{
              width: 38,
              height: 38,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 10,
              border: "1px solid rgba(255,255,255,0.15)",
              background: isMuted ? "rgba(0,0,0,0.75)" : "#00b4d8",
              color: "#fff",
              cursor: "pointer",
              backdropFilter: "blur(10px)",
              transition: "all 0.2s ease",
            }}
          >
            {isMuted ? <VolumeX size={18} strokeWidth={1.8} /> : <Volume2 size={18} strokeWidth={1.8} />}
          </button>

          {/* Interactive Volume Slider */}
          {!isMuted && (
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={handleVolumeChange}
              onClick={(e) => e.stopPropagation()}
              aria-label="Video volume"
              style={{
                width: 70,
                accentColor: "#00b4d8",
                cursor: "pointer",
              }}
            />
          )}
        </div>
      </div>

      <style jsx global>{`
        @keyframes videoSpinner {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}