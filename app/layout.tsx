import type { Metadata, Viewport } from 'next';
import { Poppins } from 'next/font/google';
import Link from 'next/link';
import './globals.css';
import { Navigation } from './components/Navigation';
import { ChatbotButton } from './components/ChatbotButton';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-poppins',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Elevar - Personal Brand Growth',
  description: 'Strategic content engines for personal brand elevation',
  manifest: '/manifest.webmanifest',
  icons: {
    icon: '/logo.svg',
    shortcut: '/logo.svg',
    apple: '/logo.svg'
  }
};

export const viewport: Viewport = {
  themeColor: '#0b0c10',
  width: 'device-width',
  initialScale: 1
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${poppins.variable} dark`} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('elevar-theme');
                  if (theme === 'light') {
                    document.documentElement.classList.remove('dark');
                    document.documentElement.classList.add('light');
                  } else {
                    document.documentElement.classList.remove('light');
                    document.documentElement.classList.add('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className={poppins.variable} suppressHydrationWarning>
        <div className="site-shell" suppressHydrationWarning>
          <Navigation />
          {children}
          <footer className="footer">
            <div className="container footer-grid">
              <div>
                <h4>Elevar</h4>
                <p>Building content systems for founders who want strategy, speed, and premium execution.</p>
                <p>© 2026 Elevar. All rights reserved.</p>
              </div>
              <div>
                <h4>Company</h4>
                <a href="/#portfolio">Portfolio</a>
                <a href="/#services">Services</a>
                <a href="/#process">Process</a>
                <Link href="/career">Career</Link>
              </div>
              <div>
                <h4>Resources</h4>
                <a href="/selected-work">Selected Work</a>
                <a href="/book-call">Book a Call</a>
                <a href="/manifest.webmanifest">Install App</a>
              </div>
              <div>
                <h4>Contact</h4>
                <p>elevardigitalstudio@gmail.com</p>
                <p>+91 9790897877</p>
              </div>
            </div>
          </footer>
          <ChatbotButton />
        </div>
      </body>
    </html>
  );
}
