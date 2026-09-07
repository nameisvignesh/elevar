import type { Metadata, Viewport } from 'next';
import { Poppins } from 'next/font/google';
import Footer from './components/Footer';
import './globals.css';
import { Navigation } from './components/Navigation';
import { ChatbotButton } from './components/ChatbotButton';
import { withBasePath } from '@/lib/paths';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-poppins',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Elevar - Personal Brand Growth',
  description: 'Strategic content engines for personal brand elevation',
  icons: {
    icon: withBasePath('/logo.svg'),
    shortcut: withBasePath('/logo.svg'),
    apple: withBasePath('/logo.svg'),
  },
};

export const viewport: Viewport = {
  themeColor: '#0b0c10',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const appShell = (
    <>
      <Navigation />
      <main>{children}</main>
      <ChatbotButton />
      <Footer />
    </>
  );

  const htmlShell = (
    <html
      lang="en"
      className={`${poppins.variable} dark`}
      suppressHydrationWarning
    >
      <head>
        <link rel="manifest" href={withBasePath('/manifest.webmanifest')} />
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
      <body>{appShell}</body>
    </html>
  );

  return htmlShell;
}
