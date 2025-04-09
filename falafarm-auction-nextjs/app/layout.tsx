import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Fala Farm',
  description: 'Premium Quality Sheep Breeding Since 2004',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}