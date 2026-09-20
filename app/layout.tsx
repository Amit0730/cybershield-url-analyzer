import type { Metadata, Viewport } from 'next';
import { Inter, Outfit } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-heading',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'CyberShield — Advanced URL Security & Phishing Risk Analyzer',
  description:
    'CyberShield analyzes suspicious URLs for phishing characteristics, homoglyph brand impersonation, Shannon entropy anomalies, and high-risk TLDs.',
  keywords: [
    'CyberShield',
    'URL Security Analyzer',
    'Phishing Detector',
    'Homoglyph Attack Scanner',
    'Punycode Decoder',
    'Malware Link Checker',
    'Domain Reputation',
    'Cybersecurity',
  ],
  authors: [{ name: 'CyberShield Security Research Team' }],
  openGraph: {
    title: 'CyberShield — Advanced URL Security & Phishing Risk Analyzer',
    description:
      'Analyze suspicious URLs for phishing indicators, homoglyph brand impersonation, Shannon entropy anomalies, and high-risk TLDs.',
    url: 'https://cybershield-url-analyzer.vercel.app',
    siteName: 'CyberShield',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CyberShield — URL Security & Phishing Risk Analyzer',
    description: 'Instant multi-vector URL security analysis and automated risk scoring.',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#030712',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`dark ${inter.variable} ${outfit.variable}`}>
      <body className="min-h-screen flex flex-col font-sans bg-slate-950 text-slate-100 antialiased selection:bg-cyan-500/30 selection:text-cyan-300 cyber-grid">
        <ThemeProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
