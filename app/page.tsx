'use client';

import Image from 'next/image';
import Link from 'next/link';
import Testimonialmarquee from './components/Testimonialmarquee';
import { motion } from 'framer-motion';

import {
  ArrowRight,
  BarChart3,
  Bot,
  FileText,
  Megaphone,
  Sparkles,
  Target,
  Video,
  Volume2,
  VolumeX,
  Search,
  Lightbulb,
  PenTool,
  ClipboardList,
  Camera,
  Scissors,
  Send,
  TrendingUp,
  Play,
  Pause,
} from 'lucide-react';

import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import { CustomBundleLink } from './components/CustomBundleLink';
import { withBasePath } from '@/lib/paths';

/* =========================================================
   TYPES
========================================================= */

type ProcessStep = {
  icon: React.ElementType;
  title: string;
  text: string;
};

type Service = {
  title: string;
  text: string;
  icon: React.ElementType;
  custom?: boolean;
};

type WorkVideoItem = {
  id: string;
  src: string;
  poster?: string;
};

/* =========================================================
   PROCESS STEPS
========================================================= */

const processSteps: ProcessStep[] = [
  {
    icon: Search,
    title: 'Business Discovery',
    text: 'We unpack goals, offer, ICP, conversion gaps, and the brand voice that should lead the system.',
  },
  {
    icon: Lightbulb,
    title: 'Strategy',
    text: 'A content and positioning plan built around sharp hooks, repeatable themes, and offer clarity.',
  },
  {
    icon: PenTool,
    title: 'Script Writing',
    text: 'Psychology-backed scripts focused on retention, authority, and action.',
  },
  {
    icon: ClipboardList,
    title: 'Pre-Production',
    text: 'Shot lists, references, assets, and timelines prepared before production starts.',
  },
  {
    icon: Camera,
    title: 'Production',
    text: 'High-end capture direction using practical lighting, clean frames, and energetic pacing.',
  },
  {
    icon: Scissors,
    title: 'Post Production',
    text: 'Editing, sound design, color, motion graphics, and fast platform-ready exports.',
  },
  {
    icon: Send,
    title: 'Publishing',
    text: 'SEO optimization, thumbnails, captions, scheduling, and reach-focused rollout.',
  },
  {
    icon: TrendingUp,
    title: 'Growth Analysis',
    text: 'Performance audits that make each month smarter than the last.',
  },
];

/* =========================================================
   SERVICES
========================================================= */

const services: Service[] = [
  {
    title: 'Video Editing',
    text: 'Retention-focused editing that makes every scroll-stopping idea easier to understand.',
    icon: Video,
  },
  {
    title: 'Content Strategy',
    text: 'Custom roadmaps for founders who need authority without content chaos.',
    icon: Target,
  },
  {
    title: 'AI Production',
    text: 'AI-assisted scripts, ideation, research, and campaign systems with human taste.',
    icon: Bot,
  },
  {
    title: 'Social Management',
    text: 'Full-scale calendar, publishing, and platform care across your active channels.',
    icon: Megaphone,
  },
  {
    title: 'Brand Content',
    text: 'Conversion-minded content designed to sell products and services directly.',
    icon: FileText,
  },
  {
    title: 'Custom Bundle',
    text: 'A tailored solution for unique growth goals. Starts with a strategy call.',
    icon: Sparkles,
    custom: true,
  },
];

/* =========================================================
   PORTFOLIO VIDEOS (local /public files, portrait 9:16 reels)
========================================================= */

const work: WorkVideoItem[] = [
  {
    id: 'video-1',
    src: withBasePath('/family-friend.mp4'),
    poster: '/logo.svg',
  },
  {
    id: 'video-2',
    src: withBasePath('/final-out-tiles.mp4'),
    poster: '/logo.svg',
  },
  {
    id: 'video-3',
    src: withBasePath('/nanotiles.mp4'),
    poster: '/logo.svg',
  },
  {
    id: 'video-4',
    src: withBasePath('/reel-6-out.mp4'),
    poster: '/logo.svg',
  },
  {
    id: 'video-5',
    src: withBasePath('/final-out.mp4'),
    poster: '/logo.svg',
  },
];

const softwareLogos = [
  { name: 'After Effects', className: 'after-effects' },
  { name: 'Premiere Pro', className: 'premiere-pro' },
  { name: 'DaVinci Resolve', className: 'davinci' },
  { name: 'CapCut', className: 'capcut' },
];

const videoAiLogos = [
  { name: 'HeyGen', className: 'heygen' },
  { name: 'Higgsfield AI', className: 'higgsfield' },
  { name: 'Google Flow', className: 'google-flow' },
];

/* =========================================================
   HOME
========================================================= */

export default function Home() {
  return (
    <main>
      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="hero-section">
        <div className="container hero-details">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08, duration: 0.5 }}
            className="hero-copy small"
          >
            <span className="eyebrow">Content strategy · Production · Growth</span>
            <h1 className="hero-head">
              Video that moves your business.
            </h1>
            <p>
              We turn sharp ideas into a consistent content system — from the first script to the final cut and what comes next.
            </p>
            <div className="hero-actions">
              <Link href="/book-call" className="btn btn-primary">
                Book a strategy call
              </Link>
              <Link href="/selected-work" className="btn btn-secondary">
                Explore our work
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* =====================================================
          PROCESS
      ===================================================== */}

      <section
        id="process"
        className="section process-band"
      >
        <div className="container">
          <div className="section-heading centered">
            <h2>
              Our 8-Step System
            </h2>

            <p>
              A meticulous workflow designed to remove
              the guesswork from content production.
            </p>
          </div>

          <div className="process-grid">
            {processSteps.map((step, index) => {
              const Icon = step.icon;

              return (
                <article
                  className="process-card tilt-card"
                  key={step.title}
                >
                  <span className="process-step-num">
                    {String(index + 1).padStart(2, '0')}
                  </span>

                  <div className="process-icon">
                    <Icon size={24} strokeWidth={1.8} />
                  </div>

                  <strong
                    style={{
                      display: 'block',
                      margin: '14px 0 6px',
                      fontSize: '1rem',
                      color: 'var(--text)',
                    }}
                  >
                    {step.title}
                  </strong>

                  <p>
                    {step.text}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* =====================================================
          SERVICES
      ===================================================== */}

      <section
        id="services"
        className="section"
      >
        <div className="container">
          <div className="section-heading">
            <h2>
              Full-Stack Solutions
            </h2>
          </div>

          <div className="service-grid">
            {services.map((service) => {
              const Icon = service.icon;

              const card = (
                <article
                  className={`service-card tilt-card ${service.custom
                      ? 'featured'
                      : ''
                    }`}
                >
                  <Icon size={22} strokeWidth={1.8} />

                  <h3>
                    {service.title}
                  </h3>

                  <p>
                    {service.text}
                  </p>

                  {service.custom && (
                    <span className="quote-pill">
                      Get Custom Quote
                    </span>
                  )}
                </article>
              );

              if (service.custom) {
                return (
                  <CustomBundleLink
                    key={service.title}
                    className="custom-bundle-link"
                    aria-label="Get a custom bundle quote"
                  >
                    {card}
                  </CustomBundleLink>
                );
              }

              return (
                <div
                  key={service.title}
                >
                  {card}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =====================================================
          SELECTED WORK
      ===================================================== */}

      <section
        id="portfolio"
        className="section work-band"
      >
        <div className="container">
          <div className="section-heading row">
            <div>
              <h2>
                Selected Work
              </h2>

              <p>
                Strategic content engines we have built.
              </p>
            </div>

            <Link
              href="/selected-work"
              className="btn btn-secondary compact"
              aria-label="More selected work"
            >
              More work <ArrowRight size={15} />
            </Link>
          </div>

          <div className="work-preview-grid">
            {work.slice(0, 3).map((item) => (
              <div
                key={item.id}
                className="work-preview tilt-card"
                style={{
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <WorkPreviewVideo item={item} />

                <Link
                  href="/selected-work"
                  className="work-preview-link"
                  aria-label="View selected work"
                  style={{
                    position: 'absolute',
                    inset: 0,
                    zIndex: 2,
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================
          CREATIVE TOOLKIT
      ===================================================== */}

      <section className="section toolkit-section" aria-label="Creative toolkit">
        <div className="container">
          <LogoGroup title="Software used" logos={softwareLogos} />
          <LogoGroup title="AI for video generation" logos={videoAiLogos} />
        </div>
      </section>

      {/* =====================================================
          ABOUT
      ===================================================== */}

      <section
        id="about"
        className="section founder-section"
      >
        <div className="container">
          <div className="founder-card">
            <div className="founder-photo">
              <Image
                src={withBasePath("/founder.jpeg")}
                alt="Karthikeyan K, Founder and CEO"
                fill
                sizes="(max-width: 900px) 100vw, 420px"
                referrerPolicy="no-referrer"
              />

              <div>
                <strong>
                  Karthikeyan K
                </strong>

                <span>
                  Founder & CEO
                </span>
              </div>
            </div>

            <div className="founder-copy">
              <span className="eyebrow">
                Behind the vision
              </span>

              <h2>
                Why I Started Elevar
              </h2>

              <p>
                Elevar Studio was built to bridge
                the gap between creative artistry
                and business logic. We do not just
                make things look pretty; we make them
                perform.
              </p>

              <p>
                My vision is to help founders build audience trust and business growth with premium strategy, cinematic storytelling, and efficient content systems.
              </p>

              <div className="stat-row">
                <div>
                  <b>
                    10+
                  </b>

                  <span>
                    Brands scaled
                  </span>
                </div>

                <div>
                  <b>
                    100+ <span className="growth-arrow" aria-hidden="true">↗</span>
                  </b>

                  <span>
                    Growth rate
                  </span>
                </div>

                <div>
                  <b>
                    95%
                  </b>

                  <span>
                    Client Retention Rate
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          TESTIMONIAL
      ===================================================== */}

      <Testimonialmarquee />

      {/* =====================================================
          CTA
      ===================================================== */}

      <section className="cta-band">
        <div className="container cta-inner">
          <BarChart3 size={34} />

          <h2>
            Ready To Turn Your Content{' '}
            <span>
              Into Customers?
            </span>
          </h2>

          <p>
            Stop guessing. Start growing. Book your
            free strategy call today and let us map
            out your content growth engine.
          </p>

          <Link
            href="/book-call"
            className="btn btn-primary"
          >
            Book Your Free Strategy Call Today
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </main>
  );
}

function LogoGroup({
  title,
  logos,
}: {
  title: string;
  logos: { name: string; className: string }[];
}) {
  return (
    <div className="toolkit-group">
      <h2>{title}</h2>
      <div className="brand-logo-list">
        {logos.map((logo) => (
          <BrandLogo key={logo.name} name={logo.name} className={logo.className} />
        ))}
      </div>
    </div>
  );
}

function BrandLogo({ name, className }: { name: string; className: string }) {
  const label = <span className="brand-logo-name">{name}</span>;

  if (className === 'after-effects' || className === 'premiere-pro') {
    const short = className === 'after-effects' ? 'Ae' : 'Pr';
    return (
      <div className={`brand-logo ${className}`} role="img" aria-label={name}>
        <span className="adobe-app-icon" aria-hidden="true">{short}</span>
        {label}
      </div>
    );
  }

  if (className === 'davinci') {
    return (
      <div className={`brand-logo ${className}`} role="img" aria-label={name}>
        <svg className="davinci-mark" viewBox="0 0 48 48" aria-hidden="true">
          <path d="M24 5C16 5 10 11 10 19h14V5Z" fill="#ee3e37" />
          <path d="M29 6c8 2 13 9 13 17H28l1-17Z" fill="#f5b52d" />
          <path d="M43 28c-2 8-9 13-17 13V27l17 1Z" fill="#4eb95b" />
          <path d="M19 42C11 40 6 33 6 25h15l-2 17Z" fill="#4185d6" />
          <circle cx="24" cy="24" r="6" fill="#f7f7f5" />
        </svg>
        {label}
      </div>
    );
  }

  if (className === 'capcut') {
    return (
      <div className={`brand-logo ${className}`} role="img" aria-label={name}>
        <svg className="capcut-mark" viewBox="0 0 48 48" aria-hidden="true">
          <path d="M10 13h28L10 35h28M10 21h28L10 43h28" fill="none" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        {label}
      </div>
    );
  }

  if (className === 'heygen') {
    return (
      <div className={`brand-logo ${className}`} role="img" aria-label={name}>
        <svg className="heygen-mark" viewBox="0 0 48 48" aria-hidden="true">
          <defs><linearGradient id="heygen-gradient" x1="0" x2="1" y1="1" y2="0"><stop stopColor="#7357ff" /><stop offset=".52" stopColor="#ec63c5" /><stop offset="1" stopColor="#ffb34a" /></linearGradient></defs>
          <circle cx="24" cy="24" r="21" fill="url(#heygen-gradient)" />
          <path d="M17 30V18m0 6h14m0-6v12" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" />
        </svg>
        {label}
      </div>
    );
  }

  if (className === 'google-flow') {
    return (
      <div className={`brand-logo ${className}`} role="img" aria-label={name}>
        <svg className="google-flow-mark" viewBox="0 0 48 48" aria-hidden="true">
          <path d="M43 24.5c0-1.5-.1-2.8-.4-4.1H24v7.8h10.7a9.2 9.2 0 0 1-4 6v5.1h6.5c3.8-3.5 5.8-8.6 5.8-14.8Z" fill="#4285f4" />
          <path d="M24 44c5.4 0 9.9-1.8 13.2-4.8l-6.5-5.1c-1.8 1.2-4 2-6.7 2-5.1 0-9.4-3.5-10.9-8.2H6.4v5.3A20 20 0 0 0 24 44Z" fill="#34a853" />
          <path d="M13.1 27.9a12 12 0 0 1 0-7.8v-5.3H6.4a20 20 0 0 0 0 18.4l6.7-5.3Z" fill="#fbbc05" />
          <path d="M24 12c3 0 5.7 1 7.8 3.1l5.8-5.8C34.1 6.1 29.4 4 24 4A20 20 0 0 0 6.4 14.8l6.7 5.3C14.6 15.5 18.9 12 24 12Z" fill="#ea4335" />
        </svg>
        <span className="brand-logo-name"><span className="google-word">Google</span> Flow</span>
      </div>
    );
  }

  return (
    <div className={`brand-logo ${className}`} role="img" aria-label={name}>
      <span className="higgsfield-mark" aria-hidden="true">H</span>
      {label}
    </div>
  );
}

/* =========================================================
   VIDEO PLAYER
========================================================= */

function WorkPreviewVideo({
  item,
}: {
  item: WorkVideoItem;
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [inView, setInView] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [volume, setVolume] = useState(1);
  /* Derived from the video's intrinsic dimensions so the card renders in
     its original ratio (no cropping). */
  const aspectRatio = '9 / 16';

  /* Force DOM sync for muted property */
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
    }
  }, [isMuted]);

  /* Force DOM sync for volume property */
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = volume;
    }
  }, [volume]);

  /* Intersection Observer */
  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        setInView(entry.isIntersecting);
      },
      {
        root: null,
        rootMargin: '150px 0px',
        threshold: 0.1,
      }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const playVideo = useCallback(async () => {
    const video = videoRef.current;
    if (!video) return;

    try {
      await video.play();
      setIsPlaying(true);
    } catch {
      setIsPlaying(false);
    }
  }, []);

  const pauseVideo = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    video.pause();
    setIsPlaying(false);
  }, []);

  useEffect(() => {
    if (!inView) {
      pauseVideo();
      return;
    }

    const timer = window.setTimeout(() => {
      playVideo();
    }, 150);

    return () => window.clearTimeout(timer);
  }, [inView, playVideo, pauseVideo]);

  const togglePlay = useCallback(
    async (event?: React.MouseEvent) => {
      event?.stopPropagation();
      event?.preventDefault();

      const video = videoRef.current;
      if (!video) return;

      if (video.paused) {
        await playVideo();
      } else {
        pauseVideo();
      }
    },
    [playVideo, pauseVideo]
  );

  const toggleMute = useCallback(
    async (event?: React.MouseEvent) => {
      event?.stopPropagation();
      event?.preventDefault();

      const video = videoRef.current;
      if (!video) return;

      const nextMuted = !isMuted;
      setIsMuted(nextMuted);
      video.muted = nextMuted;

      if (!nextMuted) {
        if (video.volume <= 0) {
          video.volume = 0.7;
          setVolume(0.7);
        }

        try {
          await video.play();
          setIsPlaying(true);
        } catch {
          setIsPlaying(false);
        }
      }
    },
    [isMuted, playVideo]
  );

  const handleVolumeChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      event.stopPropagation();

      const newVolume = Number(event.target.value);
      setVolume(newVolume);

      if (videoRef.current) {
        videoRef.current.volume = newVolume;
        const muted = newVolume === 0;
        setIsMuted(muted);
        videoRef.current.muted = muted;
      }
    },
    []
  );

  const handleVideoError = useCallback(() => {
    console.error('Unable to load portfolio video:', item.src);
  }, [item.src]);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        width: '100%',
        aspectRatio,
        overflow: 'hidden',
        background: '#000',
        borderRadius: 'inherit',
        zIndex: 3, /* Keeps controls above overlay link */
      }}
    >
      {/* VIDEO */}
      <video
        ref={videoRef}
        src={inView ? item.src : undefined}
        poster={withBasePath(item.poster)}
        muted={isMuted}
        loop
        playsInline
        preload="none"
        onLoadedMetadata={() => {
          const video = videoRef.current;
          if (!video) return;

          video.muted = isMuted;
          video.volume = volume;

          if (inView) playVideo();
        }}
        onCanPlay={() => {
          if (inView) playVideo();
        }}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onError={handleVideoError}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: 'block',
          background: '#000',
          pointerEvents: 'none', /* Clicks pass through to card link behind */
        }}
      />

      {/* DARK GRADIENT */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          height: 100,
          background:
            'linear-gradient(to top, rgba(0,0,0,0.75), transparent)',
          pointerEvents: 'none',
          zIndex: 2,
        }}
      />

      {/* CONTROLS */}
      <div
        style={{
          position: 'absolute',
          left: 12,
          right: 12,
          bottom: 12,
          zIndex: 20,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          pointerEvents: 'none',
        }}
      >
        {/* PLAY / PAUSE */}
        <button
          type="button"
          onClick={togglePlay}
          aria-label={isPlaying ? 'Pause video' : 'Play video'}
          style={{
            pointerEvents: 'auto',
            width: 38,
            height: 38,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 10,
            border: '1px solid rgba(255,255,255,0.15)',
            background: 'rgba(0,0,0,0.65)',
            color: '#fff',
            cursor: 'pointer',
            backdropFilter: 'blur(10px)',
            transition: 'all 0.2s ease',
          }}
        >
          {isPlaying ? (
            <Pause size={17} strokeWidth={2} />
          ) : (
            <Play size={17} strokeWidth={2} />
          )}
        </button>

        {/* MUTE / UNMUTE */}
        <button
          type="button"
          onClick={toggleMute}
          aria-label={isMuted ? 'Unmute video' : 'Mute video'}
          aria-pressed={!isMuted}
          style={{
            pointerEvents: 'auto',
            width: 38,
            height: 38,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 10,
            border: '1px solid rgba(255,255,255,0.15)',
            background: 'rgba(0,0,0,0.65)',
            color: '#fff',
            cursor: 'pointer',
            backdropFilter: 'blur(10px)',
            transition: 'all 0.2s ease',
          }}
        >
          {isMuted ? (
            <VolumeX size={18} strokeWidth={1.8} />
          ) : (
            <Volume2 size={18} strokeWidth={1.8} />
          )}
        </button>

        {/* VOLUME SLIDER */}
        {!isMuted && (
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={volume}
            onChange={handleVolumeChange}
            aria-label="Video volume"
            style={{
              pointerEvents: 'auto',
              width: 80,
              cursor: 'pointer',
            }}
          />
        )}
      </div>
    </div>
  );
}
