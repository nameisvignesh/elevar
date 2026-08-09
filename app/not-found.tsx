import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="page">
      <section className="container">
        <div className="card" style={{ padding: 32, textAlign: 'center' }}>
          <h1>Page not found</h1>
          <p className="muted">The page you requested could not be found.</p>
          <Link href="/" className="btn btn-primary" style={{ display: 'inline-block', marginTop: 12 }}>Return home</Link>
        </div>
      </section>
    </main>
  );
}
