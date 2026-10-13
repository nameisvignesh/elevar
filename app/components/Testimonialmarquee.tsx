'use client';

import { Quote } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    text: "The best editing agency we've worked with. They actually understand retention and distribution, which is rare in this industry.",
    company: 'JSR Paints',
  },
  {
    id: 2,
    text: 'Their editing goes beyond making videos look good. They understand audience retention, distribution, and what it takes to make content perform.',
    company: 'Asanaramana Yoga Center',
  },
  {
    id: 3,
    text: 'The team at Elevar has been instrumental in helping us grow our personal brand. Their strategic approach to content creation and distribution has yielded impressive results.',
    company: 'Mosa Unisex Saloon',
  },
];

export default function TestimonialMarquee() {
  return (
    <section className="testimonial-section">
      <div className="container">
        <div className="section-heading centered">
          <span className="eyebrow">Partner feedback</span>
          <h2>What Our Partners Say</h2>
        </div>

        <div className="testimonial-grid">
          {testimonials.map((testimonial) => (
            <article className="testimonial-card" key={testimonial.id}>
              <Quote size={22} aria-hidden="true" />
              <blockquote>{testimonial.text}</blockquote>
              <p className="testimonial-company">{testimonial.company}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
