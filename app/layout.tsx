import type {Metadata} from 'next';
import './globals.css'; // Global styles

export const metadata: Metadata = {
  title: 'SankaVerse - Cyberpunk Anime & Comic Portal',
  description: 'High-performance Cyberpunk Anime, Donghua, Manga, and Comic Streaming & Reading Platform with Sanka Vollerei API integration.',
  openGraph: {
    title: 'SankaVerse - Cyberpunk Anime & Comic Portal',
    description: 'High-performance Cyberpunk Anime, Donghua, Manga, and Comic Streaming & Reading Platform with Sanka Vollerei API integration.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SankaVerse - Cyberpunk Anime & Comic Portal',
    description: 'High-performance Cyberpunk Anime, Donghua, Manga, and Comic Streaming & Reading Platform with Sanka Vollerei API integration.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
