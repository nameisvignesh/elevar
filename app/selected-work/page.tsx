"use client";

import React, { useRef, useState, useEffect } from 'react';
import Hls from 'hls.js';
import Link from 'next/link';
import { Volume2, VolumeX, ArrowLeft } from 'lucide-react';
import { getYouTubeEmbedUrl, isYouTubeVideoUrl } from '@/lib/cloudinary';

type VideoItem = {
  id: string;
  title: string;
  category: string;
  // primary src (fallback) and optional bitrate-specific variants
  src: string;
  lowSrc?: string;
  medSrc?: string;
  highSrc?: string;
  // optional HLS master playlist and WebM variants
  hlsSrc?: string;
  lowWebm?: string;
  medWebm?: string;
  highWebm?: string;
  poster: string;
};

const youtubeVideoUrlOne = process.env.NEXT_PUBLIC_YOUTUBE_VIDEO_URL_1?.trim();
const youtubeVideoUrlTwo = process.env.NEXT_PUBLIC_YOUTUBE_VIDEO_URL_2?.trim();
const youtubeVideoUrlThree = process.env.NEXT_PUBLIC_YOUTUBE_VIDEO_URL_3?.trim();
const useYouTube = (process.env.NEXT_PUBLIC_USE_YOUTUBE || '').toLowerCase() === 'true';

const videos: VideoItem[] = [
  {
    id: 'video-1',
    title: 'Brand Story Teaser',
    category: 'Brand Campaign',
    src: useYouTube && youtubeVideoUrlOne
      ? youtubeVideoUrlOne
      : '/family-friend.web.mp4',
    lowSrc: '/family-friend-480.mp4',
    medSrc: '/family-friend-720.mp4',
    highSrc: '/family-friend.web.mp4',
    poster: '/logo.svg',
  },
  {
    id: 'video-2',
    title: 'Campaign Launch Edit',
    category: 'Social Content Engine',
    src: useYouTube && youtubeVideoUrlTwo
      ? youtubeVideoUrlTwo
      : '/final-out-tiles.web.mp4',
    lowSrc: '/final-out-tiles-480.mp4',
    medSrc: '/final-out-tiles-720.mp4',
    highSrc: '/final-out-tiles.web.mp4',
    poster: '/logo.svg',
  },
  {
    id: 'video-3',
    title: 'Product Demo Reel',
    category: 'Product & Tech',
    src: useYouTube && youtubeVideoUrlThree
      ? youtubeVideoUrlThree
      : '/nanotiles.web.mp4',
    lowSrc: '/nanotiles-480.mp4',
    medSrc: '/nanotiles-720.mp4',
    highSrc: '/nanotiles.web.mp4',
    poster: '/logo.svg',
  },
];

export default function SelectedWorkPage(): JSX.Element {
  return (
    <main className="page selected-hero">
      <div className="container">
        <div style={{ marginBottom: 20 }}>
          <Link href="/" className="btn btn-secondary compact" style={{ gap: 6 }}>
            <ArrowLeft size={14} /> Back to Home
          </Link>
        </div>

        <div className="selected-head">
          <div>
            <span className="eyebrow">Portfolio Showcase</span>
            <h1>Selected Work</h1>
            <p className="muted" style={{ maxWidth: 540 }}>
              Explore our strategic content engines.
            </p>
          </div>
        </div>

        <section aria-label="Selected work videos" className="video-card-grid">
          {videos.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </section>
      </div>
    </main>
  );
}

function VideoCard({ video }: { video: VideoItem }) {
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [loadedSrc, setLoadedSrc] = useState<string | null>(null);
  const [quality, setQuality] = useState<'auto' | 'low' | 'med' | 'high' | 'hls'>('auto');
  const hlsRef = useRef<any | null>(null);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    el.muted = isMuted;
    el.defaultMuted = isMuted;
  }, [isMuted]);

  useEffect(() => {
    // Lazy-load media when the card scrolls into view and pick bitrate
    const node = containerRef.current;
    if (!node) return;

    const chooseQuality = (v: VideoItem) => {
      try {
        const nav: any = navigator as any;
        const conn = nav.connection || nav.mozConnection || nav.webkitConnection;
        const eff = conn?.effectiveType || '';
        const deviceMemory = nav.deviceMemory || 4;

        if (eff.includes('2g') || eff === 'slow-2g' || deviceMemory <= 1) {
          return v.lowSrc || v.medSrc || v.highSrc || v.src;
        }
        if (eff.includes('3g')) {
          return v.medSrc || v.lowSrc || v.highSrc || v.src;
        }
        // Default to 720p on fast connections; users can explicitly choose High.
        return v.medSrc || v.lowSrc || v.highSrc || v.src;
      } catch (e) {
        return v.src;
      }
    };

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setInView(true);
            let chosen = chooseQuality(video);
            if (quality === 'low') chosen = video.lowSrc || video.medSrc || video.highSrc || video.src;
            if (quality === 'med') chosen = video.medSrc || video.lowSrc || video.highSrc || video.src;
            if (quality === 'high') chosen = video.highSrc || video.medSrc || video.lowSrc || video.src;
            if (quality === 'hls') chosen = video.hlsSrc || chosen;
            setLoadedSrc(chosen);
            obs.unobserve(node);
          }
        });
      },
      { root: null, rootMargin: '300px', threshold: 0.25 }
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, [video.src]);

  useEffect(() => {
    // re-select source when user changes quality manually
    if (!inView) return;
    if (quality === 'auto') {
      const nav: any = navigator as any;
      const connection = nav.connection || nav.mozConnection || nav.webkitConnection;
      const effectiveType = connection?.effectiveType || '';
      const automaticSource = effectiveType.includes('2g') || effectiveType === 'slow-2g' || (nav.deviceMemory || 4) <= 1
        ? video.lowSrc || video.medSrc || video.highSrc || video.src
        : effectiveType.includes('3g')
          ? video.medSrc || video.lowSrc || video.highSrc || video.src
          : video.medSrc || video.lowSrc || video.highSrc || video.src;
      setLoadedSrc(automaticSource);
      return;
    }
    if (!containerRef.current) return;
    const chosen = quality === 'hls' ? (video.hlsSrc || loadedSrc) : (quality === 'low' ? (video.lowSrc || loadedSrc) : quality === 'med' ? (video.medSrc || loadedSrc) : quality === 'high' ? (video.highSrc || loadedSrc) : loadedSrc);
    setLoadedSrc(chosen ?? loadedSrc);
  }, [quality]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    // cleanup any previous hls
    if (hlsRef.current) {
      try { hlsRef.current.destroy(); } catch (e) { }
      hlsRef.current = null;
    }

    if (!loadedSrc) {
      v.removeAttribute('src');
      v.load();
      return;
    }

    // If HLS source or m3u8, use hls.js when needed
    if ((video.hlsSrc && quality === 'hls') || loadedSrc.endsWith('.m3u8')) {
      if (Hls.isSupported()) {
        const hls = new Hls({ enableWorker: true });
        hlsRef.current = hls;
        hls.loadSource(video.hlsSrc || loadedSrc);
        hls.attachMedia(v);
        hls.on(Hls.Events.MANIFEST_PARSED, function () {
          if (!v.muted) v.play().catch(() => { });
        });
      } else if (v.canPlayType('application/vnd.apple.mpegurl')) {
        v.src = video.hlsSrc || loadedSrc;
        v.load();
        if (!v.muted) v.play().catch(() => { });
      }
      return;
    }

    // For normal mp4/webm sources, pick webm if supported and available
    const supportsWebM = v.canPlayType('video/webm; codecs="vp9,opus"') || v.canPlayType('video/webm; codecs="vp8,vorbis"');
    let finalSrc = loadedSrc;
    if (supportsWebM) {
      if (quality === 'low' && video.lowWebm) finalSrc = video.lowWebm;
      else if (quality === 'med' && video.medWebm) finalSrc = video.medWebm;
      else if (quality === 'high' && video.highWebm) finalSrc = video.highWebm;
    }

    v.src = finalSrc;
    v.load();
    if (inView && !v.muted) {
      v.play().catch(() => { });
    }

    return () => {
      if (hlsRef.current) {
        try { hlsRef.current.destroy(); } catch (e) { }
        hlsRef.current = null;
      }
    };
  }, [loadedSrc, inView]);

  const toggleMute = async (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const el = videoRef.current;
    if (!el) return;

    const nextMuted = !isMuted;
    el.muted = nextMuted;
    el.defaultMuted = nextMuted;

    if (!nextMuted) {
      el.volume = 1;
    }

    setIsMuted(nextMuted);

    if (!nextMuted) {
      try {
        await el.play();
      } catch (error) {
        console.error('Audio playback interrupted:', error);
      }
    }
  };

  const toggleYouTubeMute = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setIsMuted((prev) => !prev);
  };

  const youTubeEmbedUrl = getYouTubeEmbedUrl(video.src);
  const shouldUseYouTube = isYouTubeVideoUrl(video.src);
  const youtubeVideoId = youTubeEmbedUrl?.split('/').pop()?.split('?')[0] ?? '';
  const youtubePlayerSrc = shouldUseYouTube && youTubeEmbedUrl && inView
    ? `${youTubeEmbedUrl}?autoplay=1&mute=${isMuted ? 1 : 0}&controls=0&loop=1&playlist=${youtubeVideoId}&playsinline=1&modestbranding=1&rel=0&iv_load_policy=3&fs=0&disablekb=1`
    : null;

  return (
    <div
      ref={containerRef}
      className="video-card tilt-card"
      style={{ position: 'relative', display: 'flex', flexDirection: 'column' }}
      role="region"
      aria-label={`Video: ${video.title}`}
    >
      {shouldUseYouTube ? (
        <div style={{ position: 'relative', width: '100%', height: '100%', background: '#000' }}>
          {inView && youtubePlayerSrc ? (
            <iframe
              src={youtubePlayerSrc}
              title={video.title}
              allow="autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
              loading="lazy"
              style={{ width: '100%', height: '100%', border: 0 }}
            />
          ) : (
            // placeholder div keeps layout until iframe loads
            <div style={{ width: '100%', height: '100%', background: '#000' }} />
          )}
          <button
            type="button"
            onClick={toggleYouTubeMute}
            aria-label={isMuted ? 'Unmute video' : 'Mute video'}
            className="work-preview-audio"
            style={{
              position: 'absolute',
              top: 14,
              right: 14,
              zIndex: 4,
            }}
          >
            {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
        </div>
      ) : (
        <video
          ref={videoRef}
          src={undefined}
          data-src={video.src}
          poster={video.poster}
          muted={isMuted}
          autoPlay={inView}
          loop
          controls={false}
          playsInline
          preload={inView ? 'metadata' : 'none'}
          onError={() => {
            if (loadedSrc && loadedSrc !== video.src) {
              setLoadedSrc(video.src);
            }
          }}
          onVolumeChange={() => {
            if (videoRef.current) {
              setIsMuted(videoRef.current.muted);
            }
          }}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        >
          {/* sources will be attached programmatically based on loadedSrc and available variants */}
        </video>
      )}

      {!shouldUseYouTube && (
        <>
          <button
            type="button"
            onClick={toggleMute}
            aria-label={isMuted ? 'Unmute video' : 'Mute video'}
            className="work-preview-audio"
            style={{
              position: 'absolute',
              top: 14,
              right: 14,
              zIndex: 4,
            }}
          >
            {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>

          <div style={{ position: 'absolute', top: 14, right: 64, zIndex: 5, display: 'flex', gap: 6 }}>
            <select
              aria-label="Quality"
              value={quality}
              onChange={(e) => setQuality(e.target.value as any)}
              style={{ padding: '6px 8px', borderRadius: 8, background: 'rgba(0,0,0,0.6)', color: '#fff', border: '1px solid rgba(255,255,255,0.12)' }}
            >
              <option value="auto">Auto</option>
              <option value="low">Low</option>
              <option value="med">Med</option>
              <option value="high">High</option>
              {video.hlsSrc && <option value="hls">HLS</option>}
            </select>
          </div>
        </>
      )}

    </div>
  );
}
