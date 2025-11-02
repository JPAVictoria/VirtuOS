import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter'
})

export const metadata = {
  title: 'VirtuOS',
  description:
    'An interactive web-based OS security simulator that visualizes user roles, access control, and privilege enforcement.',
  keywords: ['VirtuOS', 'Operating System Security', 'Simulation', 'Next.js', 'Terminal', 'Web App'],
  authors: [{ name: 'Dre' }],
  openGraph: {
    title: 'VirtuOS – OS Security Simulator',
    description:
      'Experience how operating systems enforce security and access control through a simulated web terminal.',
    url: 'https://virtuos.vercel.app',
    siteName: 'VirtuOS',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'VirtuOS – OS Security Simulation'
      }
    ],
    locale: 'en_US',
    type: 'website'
  },
  icons: {
    icon: '/favicon.ico'
  }
}

export default function RootLayout({ children }) {
  return (
    <html lang='en'>
      <body className={`${inter.variable} antialiased`}>{children}</body>
    </html>
  )
}
