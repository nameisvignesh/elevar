'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  Bot,
  Clapperboard,
  FileText,
  Megaphone,
  Sparkles,
  Target,
  Video,
  Volume2,
  VolumeX
} from 'lucide-react';
import { CustomBundleButton } from './components/CustomBundleButton';
import React, { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import { getYouTubeEmbedUrl, isYouTubeVideoUrl } from '@/lib/cloudinary';

type AppVideoItem = {
  id: string;
  title: string;
  src: string;
  poster?: string;
};

type WorkVideoItem = {
  src: string;
  lowSrc?: string;
  medSrc?: string;
  highSrc?: string;
  hlsSrc?: string;
  poster: string;
};

const processSteps = [
  ['01', 'Business Discovery', 'We unpack goals, offer, ICP, conversion gaps, and the brand voice that should lead the system.'],
  ['02', 'Strategy', 'A content and positioning plan built around sharp hooks, repeatable themes, and offer clarity.'],
  ['03', 'Script Writing', 'Psychology-backed scripts focused on retention, authority, and action.'],
  ['04', 'Pre-Production', 'Shot lists, references, assets, and timelines prepared before production starts.'],
  ['05', 'Production', 'High-end capture direction using practical lighting, clean frames, and energetic pacing.'],
  ['06', 'Post Production', 'Editing, sound design, color, motion graphics, and fast platform-ready exports.'],
  ['07', 'Publishing', 'SEO optimization, thumbnails, captions, scheduling, and reach-focused rollout.'],
  ['08', 'Growth Analysis', 'Performance audits that make each month smarter than the last.']
];

const services = [
  { title: 'Video Editing', text: 'Retention-focused editing that makes every scroll-stopping idea easier to understand.', icon: Video },
  { title: 'Content Strategy', text: 'Custom roadmaps for founders who need authority without content chaos.', icon: Target },
  { title: 'AI Production', text: 'AI-assisted scripts, ideation, research, and campaign systems with human taste.', icon: Bot },
  { title: 'Social Management', text: 'Full-scale calendar, publishing, and platform care across your active channels.', icon: Megaphone },
  { title: 'Brand Content', text: 'Conversion-minded content designed to sell products and services directly.', icon: FileText },
  { title: 'Custom Bundle', text: 'A tailored solution for unique growth goals. Starts with a strategy call.', icon: Sparkles, custom: true }
];

const youtubeVideoUrlOne = process.env.NEXT_PUBLIC_YOUTUBE_VIDEO_URL_1?.trim();
const youtubeVideoUrlTwo = process.env.NEXT_PUBLIC_YOUTUBE_VIDEO_URL_2?.trim();
const youtubeVideoUrlThree = process.env.NEXT_PUBLIC_YOUTUBE_VIDEO_URL_3?.trim();
const useYouTube = (process.env.NEXT_PUBLIC_USE_YOUTUBE || '').toLowerCase() === 'true';

const work: WorkVideoItem[] = [
  {
    src: useYouTube && youtubeVideoUrlOne
      ? youtubeVideoUrlOne
      : '/family-friend.web.mp4',
    lowSrc: '/family-friend-480.mp4',
    medSrc: '/family-friend-720.mp4',
    highSrc: '/family-friend.web.mp4',
    poster: '/logo.svg',
  },
  {
    src: useYouTube && youtubeVideoUrlTwo
      ? youtubeVideoUrlTwo
      : '/final-out-tiles.web.mp4',
    lowSrc: '/final-out-tiles-480.mp4',
    medSrc: '/final-out-tiles-720.mp4',
    highSrc: '/final-out-tiles.web.mp4',
    poster: '/logo.svg'
  },
  {
    src: useYouTube && youtubeVideoUrlThree
      ? youtubeVideoUrlThree
      : '/nanotiles.web.mp4',
    lowSrc: '/nanotiles-480.mp4',
    medSrc: '/nanotiles-720.mp4',
    highSrc: '/nanotiles.web.mp4',
    poster: '/logo.svg',
  }
];

export default function Home() {
  return (
    <main className="home-page">
        <section className="hero-full hero-band">
          <div className="hero-bg" />
          <div className="container hero-content">
            <div className="hero-shapes" aria-hidden>
              <div className="shape shape--blob-1" />
              <div className="shape shape--blob-2" />
              <div className="grain" />
            </div>

            <div className="container hero-details">
              <div className="hero-detail-grid">
                <motion.div
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08, duration: 0.5 }}
                  className="hero-copy small"
                >
                  <span className="eyebrow">Content ROI Agency</span>
                  <h2 className="sub-head">We don't just edit videos.<br />We build <span className="gradient">content</span> that grows<br />your business.</h2>
                  <p>From strategy to publishing and growth analysis, we handle the full lifecycle of high-performance business content.</p>
                  <div className="hero-actions">
                    <a href="https://elevar-digital-studio.vercel.app/book-call" className="btn btn-primary">Book Free Strategy Call</a>
                    <a href="https://elevar-digital-studio.vercel.app/selected-work" className="btn btn-secondary">View Our Work</a>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.14, duration: 0.55 }}
                  className="myth-panel tilt-card"
                >
                  <div className="myth-visual">
                    <Clapperboard size={34} />
                    <strong>The "80% Gap" in Modern Video Strategy</strong>
                    <span>Most creators edit. We engineer business impact.</span>
                  </div>
                  <div className="myth-stack">
                    <div className="mini-alert">
                      <small>Common business myth</small>
                      <b>"Just make it look cool."</b>
                      <span>Editing is 100% of value. No strategy, hooks, conversion logic.</span>
                    </div>
                    <div className="mini-alert active">
                      <small>The Elevar approach</small>
                      <b>Strategy to ROI</b>
                      <span>Editing is only 20%. The other 80% is distribution and conversion.</span>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        <section id="process" className="section process-band">
          <div className="container">
            <div className="section-heading centered">
              <h2>Our 8-Step System</h2>
              <p>A meticulous workflow designed to remove the guesswork from content production.</p>
            </div>
            <div className="process-grid">
              {processSteps.map(([num, title, text]) => (
                <article className="process-card tilt-card" key={num}>
                  <span>{num}</span>
                  <strong style={{ display: 'block', margin: '8px 0 4px', fontSize: '1rem', color: 'var(--text)' }}>{title}</strong>
                  <p>{text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="services" className="section">
          <div className="container">
            <div className="section-heading">
              <h2>Full-Stack Solutions</h2>
            </div>
            <div className="service-grid">
              {services.map((service) => {
                const Icon = service.icon;
                const card = (
                  <article className={`service-card tilt-card ${service.custom ? 'featured' : ''}`}>
                    <Icon size={22} />
                    <h3>{service.title}</h3>
                    <p>{service.text}</p>
                    {service.custom && <span className="quote-pill">Get Custom Quote</span>}
                  </article>
                );
                return service.custom ? (
                  <CustomBundleButton key={service.title} className="plain-action">
                    {card}
                  </CustomBundleButton>
                ) : (
                  <div key={service.title}>{card}</div>
                );
              })}
            </div>
          </div>
        </section>

        <section id="portfolio" className="section work-band">
          <div className="container">
            <div className="section-heading row">
              <div>
                <h2>Selected Work</h2>
                <p>Strategic content engines we have built.</p>
              </div>
              <Link href="/selected-work" className="btn btn-secondary compact">All Projects</Link>
            </div>
            <div className="work-preview-grid">
              {work.map((item, index) => (
                <div key={item.src || index} className="work-preview tilt-card">
                  <WorkPreviewVideo item={item} />
                  <Link href="/selected-work" className="work-preview-link" aria-label="View all selected work" />
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="about" className="section founder-section">
          <div className="container">
            <div className="founder-card">
              <div className="founder-photo">
                <Image
                  src="/founder.jpeg"
                  alt="Karthikeyan K, Founder and CEO"
                  fill
                  sizes="(max-width: 900px) 100vw, 420px"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <strong>Karthikeyan K</strong>
                  <span>Founder & CEO</span>
                </div>
              </div>
              <div className="founder-copy">
                <span className="eyebrow">Behind the vision</span>
                <h2>Why I Started Elevar</h2>
                <p>
                  Elevar Studio was built to bridge the gap between creative artistry and business logic. We do not just make things look pretty; we make them perform.
                </p>
                <p>
                  My vision is to help founders break scale with premium strategy, cinematic storytelling, and efficient content systems.
                </p>
                <div className="stat-row">
                  <div><b>10+</b><span>Brands scaled</span></div>
                  <div><b>50K+</b><span>Total views</span></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section testimonial-band">
          <div className="container">
            <div className="section-heading centered"><h2>What Our Partners Say</h2></div>
            <div className="testimonial-card tilt-card">
              <p>"The best editing agency we've worked with. They actually understand retention and distribution, which is rare in this industry."</p>
              <div><BadgeCheck size={18} /><span>JSR Paints</span></div>
            </div>
          </div>
        </section>

        <section className="cta-band">
          <div className="container cta-inner">
            <BarChart3 size={34} />
            <h2>Ready To Turn Your Content <span>Into Customers?</span></h2>
            <p>Stop guessing. Start growing. Book your free strategy call today and let us map out your content growth engine.</p>
            <Link href="/book-call" className="btn btn-primary">Book Your Free Strategy Call Today <ArrowRight size={16} /></Link>
          </div>
        </section>
    </main>
  );
}

function WorkPreviewVideo({ item }: { item: WorkVideoItem }) {
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [volume, setVolume] = useState(1);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [loadedSrc, setLoadedSrc] = useState<string | null>(null);
  const [quality, setQuality] = useState<'auto' | 'low' | 'med' | 'high' | 'hls'>('auto');
  const hlsRef = useRef<Hls | null>(null);

  const shouldUseYouTube = isYouTubeVideoUrl(item.src);
  const youTubeEmbedUrl = getYouTubeEmbedUrl(item.src);
  const youtubeVideoId = youTubeEmbedUrl?.split('/').pop()?.split('?')[0] ?? '';

  const youtubePlayerSrc =
    shouldUseYouTube && youTubeEmbedUrl
      ? `${youTubeEmbedUrl}?autoplay=1&mute=1&controls=0&loop=1&playlist=${youtubeVideoId}&playsinline=1&modestbranding=1&rel=0&iv_load_policy=3&fs=0&disablekb=1`
      : null;

  const chooseSource = (selectedQuality: typeof quality) => {
    if (selectedQuality === 'hls') return item.hlsSrc ?? item.src;
    if (selectedQuality === 'low') return item.lowSrc ?? item.medSrc ?? item.highSrc ?? item.src;
    if (selectedQuality === 'med') return item.medSrc ?? item.lowSrc ?? item.highSrc ?? item.src;
    if (selectedQuality === 'high') return item.highSrc ?? item.medSrc ?? item.lowSrc ?? item.src;

    const nav = navigator as Navigator & {
      connection?: { effectiveType?: string };
      mozConnection?: { effectiveType?: string };
      webkitConnection?: { effectiveType?: string };
      deviceMemory?: number;
    };
    const connection = nav.connection || nav.mozConnection || nav.webkitConnection;
    if (connection?.effectiveType?.includes('2g') || (nav.deviceMemory ?? 4) <= 1) {
      return item.lowSrc ?? item.medSrc ?? item.highSrc ?? item.src;
    }
    if (connection?.effectiveType?.includes('3g')) {
      return item.medSrc ?? item.lowSrc ?? item.highSrc ?? item.src;
    }
    return item.medSrc ?? item.lowSrc ?? item.highSrc ?? item.src;
  };

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setInView(true);
            setLoadedSrc(chooseSource('auto'));
            obs.unobserve(node);
          }
        });
      },
      { root: null, rootMargin: '300px', threshold: 0.25 }
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, [item.src]);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    el.muted = isMuted;
    el.defaultMuted = isMuted;
    el.volume = volume;
  }, [isMuted, volume]);

  useEffect(() => {
    if (inView) setLoadedSrc(chooseSource(quality));
  }, [quality, inView, item.src]);

  useEffect(() => {
    const player = videoRef.current;
    if (!player || !loadedSrc) return;

    hlsRef.current?.destroy();
    hlsRef.current = null;

    if (loadedSrc.includes('.m3u8')) {
      if (Hls.isSupported()) {
        const hls = new Hls({ enableWorker: true });
        hlsRef.current = hls;
        hls.loadSource(loadedSrc);
        hls.attachMedia(player);
      } else if (player.canPlayType('application/vnd.apple.mpegurl')) {
        player.src = loadedSrc;
        player.load();
      }
    } else {
      player.src = loadedSrc;
      player.load();
    }

    if (inView) player.play().catch(() => undefined);
    return () => {
      hlsRef.current?.destroy();
      hlsRef.current = null;
    };
  }, [loadedSrc, inView]);

  const toggleMute = async (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const player = videoRef.current;
    if (!player || shouldUseYouTube) return;

    const nextMuted = !player.muted;
    player.muted = nextMuted;
    player.defaultMuted = nextMuted;
    setIsMuted(nextMuted);

    if (!nextMuted) {
      player.volume = 1;
      try {
        await player.play();
        setIsPlaying(true);
      } catch {
        // Interrupted
      }
    }
  };

  const togglePlay = async (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const player = videoRef.current;
    if (!player || shouldUseYouTube) return;

    if (player.paused) {
      try {
        await player.play();
        setIsPlaying(true);
      } catch {
        // Interrupted
      }
    } else {
      player.pause();
      setIsPlaying(false);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);

    if (videoRef.current) {
      videoRef.current.volume = newVol;
      if (newVol === 0) {
        videoRef.current.muted = true;
        setIsMuted(true);
      } else {
        videoRef.current.muted = false;
        setIsMuted(false);
      }
    }
  };

  const handleCardClick = () => {
    if (shouldUseYouTube) return;
    if (isMuted) toggleMute();
    else togglePlay();
  };

  return (
    <>
      <div ref={containerRef} style={{ width: '100%', height: '100%' }}>
        {shouldUseYouTube ? (
          inView && youtubePlayerSrc ? (
            <div style={{ width: '100%', height: '100%', background: '#000' }}>
              <iframe
                src={youtubePlayerSrc}
                title="Selected work video"
                allow="autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
                loading="lazy"
                style={{ width: '100%', height: '100%', border: 0 }}
              />
            </div>
          ) : (
            <div style={{ width: '100%', height: '100%', background: '#000' }} />
          )
        ) : (
          <video
            ref={videoRef}
            data-src={item.src}
            poster={item.poster}
            muted={isMuted}
            autoPlay={inView}
            loop
            playsInline
            preload={inView ? 'metadata' : 'none'}
            onError={() => {
              if (loadedSrc && loadedSrc !== item.src) {
                setLoadedSrc(item.src);
              }
            }}
            onVolumeChange={() => {
              if (videoRef.current) {
                setIsMuted(videoRef.current.muted);
              }
            }}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        )}
      </div>

      {!shouldUseYouTube && (
        <button
          type="button"
          className="work-preview-audio"
          onClick={toggleMute}
          aria-label={isMuted ? 'Unmute video' : 'Mute video'}
          aria-pressed={!isMuted}
        >
          {isMuted ? <VolumeX size={18} aria-hidden="true" /> : <Volume2 size={18} aria-hidden="true" />}
        </button>
      )}
      {!shouldUseYouTube && (
        <div style={{ position: 'absolute', top: 12, right: 64, zIndex: 5 }}>
          <select
            aria-label="Quality"
            value={quality}
            onChange={(e) => setQuality(e.target.value as typeof quality)}
            style={{ padding: '6px 8px', borderRadius: 8, background: 'rgba(0,0,0,0.6)', color: '#fff', border: '1px solid rgba(255,255,255,0.12)' }}
          >
            <option value="auto">Auto</option>
            <option value="low">Low</option>
            <option value="med">Med</option>
            <option value="high">High</option>
            {item.hlsSrc && <option value="hls">HLS</option>}
          </select>
        </div>
      )}
    </>
  );
}
