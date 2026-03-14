import type { Metadata } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', preload: false });
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-display', preload: false });

export const metadata: Metadata = {
  title: 'TeleTrade Hub - Premium Electronics & Telecommunications',
  description: 'Shop the latest smartphones, tablets, and electronics at TeleTrade Hub',
  keywords: 'electronics, smartphones, tablets, telecommunications',
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/icon.svg',
    apple: '/icon.svg',
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
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
