'use client';

import { BadgeCheck } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const testimonials = [
  {
    id: 1,
    text: "The best editing agency we've worked with. They actually understand retention and distribution, which is rare in this industry.",
    company: 'JSR Paints',
  },
  {
    id: 2,
    text: "Their editing goes beyond making videos look good. They understand audience retention, distribution, and what it takes to make content perform.",
    company: 'Asanaramana Yoga Center',
  },
  {
    id: 3,
    text: "The team at Elevar has been instrumental in helping us grow our personal brand. Their strategic approach to content creation and distribution has yielded impressive results.",
    company: 'Mosa Unisex Saloon',
  },
];

export default function TestimonialMarquee() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          setInView(true);
          observer.unobserve(entry.target);
        }
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 0.2,
      }
    );

    observer.observe(section);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <section className="testimonial-section" ref={sectionRef}>
      <div className="container">
        <div className="section-heading centered">
          <h2>What Our Partners Say</h2>
        </div>

        <div className="testimonial-grid">
          {testimonials.map((testimonial) => (
            <div 
              key={testimonial.id} 
              className={`testimonial-card tilt-card ${inView ? 'in-view' : ''}`}
            >
              <p>"{testimonial.text}"</p>
              <div>
                <BadgeCheck size={18} />
                <span>{testimonial.company}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}