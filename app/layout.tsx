import type { Metadata, Viewport } from 'next';
import { Poppins } from 'next/font/google';
import Footer from './components/Footer';
import Link from 'next/link';
import {
  Building2,
  BriefcaseBusiness,
  Layers3,
  Workflow,
  UserRound,
  FolderKanban,
  CalendarCheck,
  Download,
  Mail,
  Phone,
} from 'lucide-react';

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
  description:
    'Strategic content engines for personal brand elevation',
  manifest: '/manifest.webmanifest',
  icons: {
    icon: '/logo.svg',
    shortcut: '/logo.svg',
    apple: '/logo.svg',
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
  return (
    <html
      lang="en"
      className={`${poppins.variable} dark`}
      suppressHydrationWarning
    >
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

      <body>
        <Navigation />

        <main>{children}</main>

        <ChatbotButton />

        {/* =====================================================
            FOOTER
        ===================================================== */}

        <Footer />

      </body>
    </html>
  );
}