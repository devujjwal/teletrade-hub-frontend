import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'TeleTrade Hub - Premium Electronics & Telecommunications',
  description: 'Shop the latest smartphones, tablets, and electronics at TeleTrade Hub',
  keywords: 'electronics, smartphones, tablets, telecommunications',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  );
}

