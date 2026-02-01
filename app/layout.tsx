import React from "react"
import type { Metadata, Viewport } from 'next'
import { Inter, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Toaster } from 'sonner'
import './globals.css'

const _inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const _geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: 'FiveM Hub - Partage de Ressources',
  description: 'Plateforme de partage de scripts, mappings, tools, loading screens et bases pour FiveM',
  generator: 'FiveM Hub',
  icons: {
    icon: '/favicon.ico',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#0a0a0f',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr" className="dark bg-background">
      <body className={`${_inter.variable} ${_geistMono.variable} font-sans antialiased min-h-screen`}>
        {children}
        <Toaster 
          position="top-right" 
          toastOptions={{
            style: {
              background: 'oklch(0.12 0.015 260)',
              border: '1px solid oklch(0.22 0.02 260)',
              color: 'oklch(0.95 0 0)',
            },
          }}
        />
        <Analytics />
      </body>
    </html>
  )
}
