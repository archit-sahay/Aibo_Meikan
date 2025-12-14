import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/ThemeProvider'
import { ThemeToggle } from '@/components/ThemeToggle'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Infibizz - Partner Registration',
  description: 'Join us as a trusted partner and be part of a fast-growing financial marketplace',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
            <nav className="border-b border-gray-200 dark:border-gray-800">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                  <a href="/" className="text-xl font-bold text-gray-900 dark:text-white">
                    Infibizz
                  </a>
                  <div className="flex items-center gap-4">
                    <a
                      href="/register"
                      className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                      Register
                    </a>
                    <a
                      href="/contact"
                      className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                      Contact Us
                    </a>
                    <a
                      href="/admin"
                      className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                      Admin
                    </a>
                    <ThemeToggle />
                  </div>
                </div>
              </div>
            </nav>
            <main>{children}</main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}

