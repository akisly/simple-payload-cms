import React from 'react'
import Link from 'next/link'
import './styles.css'

export const metadata = {
  title: 'The Edition · Multi-Edition Magazine',
  description: 'A self-hosted Payload CMS v3 + Next.js multi-edition magazine demo.',
}

export default function FrontendLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="site-header">
          <div className="container">
            <Link href="/" className="brand">
              The <span>Edition</span>
            </Link>
            <nav className="nav">
              <Link href="/">Editions</Link>
              <Link href="/admin">Admin</Link>
            </nav>
          </div>
        </header>
        <main>{children}</main>
        <footer className="site-footer">
          <div className="container">
            Built with Payload CMS v3 + Next.js (App Router) · Postgres · Vercel-ready
          </div>
        </footer>
      </body>
    </html>
  )
}
