'use client';

import Image from 'next/image';
import Link from 'next/link';
import Testimonialmarquee from './components/Testimonialmarquee';
import { motion } from 'framer-motion';

import {
  ArrowRight,
  BarChart3,
  Bot,
  Clapperboard,
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

import { CustomBundleButton } from './components/CustomBundleButton';

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
  title: string;
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
   VERCEL BLOB VIDEOS
========================================================= */

const work: WorkVideoItem[] = [
  {
    id: 'video-1',
    title: '',
    src: 'https://xiniunszguqd8c4n.public.blob.vercel-storage.com/family-friend.mp4',
    poster: '/logo.svg',
  },
  {
    id: 'video-2',
    title: '',
    src: 'https://xiniunszguqd8c4n.public.blob.vercel-storage.com/final-out-tiles.mp4',
    poster: '/logo.svg',
  },
  {
    id: 'video-3',
    title: '',
    src: 'https://xiniunszguqd8c4n.public.blob.vercel-storage.com/nanotiles.mp4',
    poster: '/logo.svg',
  },
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
          <div className="hero-detail-grid">
            {/* HERO COPY */}

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.08,
                duration: 0.5,
              }}
              className="hero-copy small"
            >
              <span className="eyebrow">
                Content ROI Agency
              </span>

              <h2 className="sub-head">
                We don't just edit videos.
                <br />
                We build{' '}
                <span className="gradient">
                  content
                </span>{' '}
                that grows
                <br />
                your business.
              </h2>

              <p>
                From strategy to publishing and growth
                analysis, we handle the full lifecycle of
                high-performance business content.
              </p>

              <div className="hero-actions">
                <Link
                  href="/book-call"
                  className="btn btn-primary"
                >
                  Book Free Strategy Call
                </Link>

                <Link
                  href="/selected-work"
                  className="btn btn-secondary"
                >
                  View Our Work
                </Link>
              </div>
            </motion.div>

            {/* MYTH PANEL */}

            <motion.div
              initial={{
                opacity: 0,
                y: 18,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 0.14,
                duration: 0.55,
              }}
              className="myth-panel tilt-card"
            >
              <div className="myth-visual">
                <Clapperboard size={34} />

                <strong>
                  The "80% Gap" in Modern Video Strategy
                </strong>

                <span>
                  Most creators edit. We engineer
                  business impact.
                </span>
              </div>

              <div className="myth-stack">
                <div className="mini-alert">
                  <small>
                    Common business myth
                  </small>

                  <b>
                    "Just make it look cool."
                  </b>

                  <span>
                    Editing is 100% of value. No
                    strategy, hooks, conversion logic.
                  </span>
                </div>

                <div className="mini-alert active">
                  <small>
                    The Elevar approach
                  </small>

                  <b>
                    Strategy to ROI
                  </b>

                  <span>
                    Editing is only 20%. The other 80%
                    is distribution and conversion.
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
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
            {processSteps.map((step) => {
              const Icon = step.icon;

              return (
                <article
                  className="process-card tilt-card"
                  key={step.title}
                >
                  <div className="process-icon">
                    <Icon
                      color="#0077b6"
                      size={24}
                      strokeWidth={1.8}
                    />
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
                  <Icon
                    color="#0077b6"
                    size={22}
                    strokeWidth={1.8}
                  />

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
                  <CustomBundleButton
                    key={service.title}
                    className="plain-action"
                  >
                    {card}
                  </CustomBundleButton>
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
            >
              All Projects
            </Link>
          </div>

          <div className="work-preview-grid">
            {work.map((item) => (
              <div
                key={item.id}
                className="work-preview tilt-card"
                style={{
                  position: 'relative',
                  aspectRatio: '3 / 4',
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
                src="/founder.jpeg"
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
                My vision is to help founders break
                scale with premium strategy, cinematic
                storytelling, and efficient content
                systems.
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
                    100K+
                  </b>

                  <span>
                    Total views
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
    console.error('Unable to load Vercel Blob video:', item.src);
  }, [item.src]);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
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
        poster={item.poster}
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
            background: isMuted ? 'rgba(0,0,0,0.65)' : 'rgba(0,180,216,0.8)',
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