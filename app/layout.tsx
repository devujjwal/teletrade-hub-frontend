import type { Metadata } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import NextTopLoader from 'nextjs-toploader';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', preload: false });
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-display', preload: false });

export const metadata: Metadata = {
  title: 'TeleTrade Hub - Premium Electronics & Telecommunications',
  description: 'Shop the latest smartphones, tablets, and electronics at TeleTrade Hub',
  keywords: 'electronics, smartphones, tablets, telecommunications',
  icons: {
    icon: [
      { url: '/images/favicon.ico', type: 'image/x-icon' },
    ],
    shortcut: '/images/favicon.ico',
    apple: '/images/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${spaceGrotesk.variable}`}
      data-scroll-behavior="smooth"
    >
      <body>
        <NextTopLoader
          color="hsl(var(--secondary))"
          initialPosition={0.08}
          crawlSpeed={180}
          height={3}
          crawl={true}
          showSpinner={false}
          easing="ease"
          speed={220}
          shadow="0 0 10px hsl(var(--secondary)), 0 0 5px hsl(var(--secondary))"
          zIndex={1600}
        />
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
