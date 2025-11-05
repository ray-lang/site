import type { Metadata } from "next"
import { Barlow_Condensed } from "next/font/google"
import { ThemeProvider } from 'next-themes';
import Link from "next/link"
import "./globals.css"

const barlow = Barlow_Condensed({
  weight: ["800"],
  style: ["italic"],
  subsets: ["latin"],
  variable: "--font-barlow",
});

export const metadata: Metadata = {
  title: "Ray — WASM-first language",
  description: "Build small, fast binaries for the web and beyond."
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={barlow.variable} suppressHydrationWarning>
      <body className="text-gray-900 dark:text-white">
        <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur dark:bg-black/70">
          <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
            <Link
              href="/"
              className="text-3xl font-bold"
              style={{ fontFamily: "var(--font-barlow)" }}
            >
              RAY
            </Link>
            <div className="flex gap-6 text-sm">
              <Link href="/language" className="hover:text-gray-700">Language</Link>
              <Link href="/docs" className="hover:text-gray-700">Docs</Link>
              <Link href="/playground" className="hover:text-gray-700">Playground</Link>
              <Link href="/roadmap" className="hover:text-gray-700">Roadmap</Link>
              <Link href="/blog" className="hover:text-gray-700">Blog</Link>
              <Link href="/contribute" className="hover:text-gray-700">Contribute</Link>
            </div>
          </nav>
        </header>

        <main className="mx-auto max-w-6xl px-4">
          <ThemeProvider>{children}</ThemeProvider>
        </main>

        <footer className="mx-auto max-w-6xl px-4 py-12 text-sm text-gray-500">
          Ray © {new Date().getFullYear()}
        </footer>
      </body>
    </html>
  )
}
