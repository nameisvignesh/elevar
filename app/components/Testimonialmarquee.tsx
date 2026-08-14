'use client';

import { BadgeCheck } from 'lucide-react';

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
  return (
    <section className="testimonial-section">
      {/* Square pattern background */}
      <div className="testimonial-pattern" aria-hidden="true" />

      <div className="container">
        <div className="section-heading centered">
          <h2>What Our Partners Say</h2>
        </div>
      </div>

      {/* Single pass marquee — pauses on hover */}
      <div className="testimonial-marquee">
        <div className="testimonial-marquee-track">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="testimonial-card tilt-card"
            >
              <div className="testimonial-header">
                <div className="testimonial-meta">
                  <BadgeCheck size={16} />
                  <span>{testimonial.company}</span>
                </div>
              </div>
              <p>"{testimonial.text}"</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
