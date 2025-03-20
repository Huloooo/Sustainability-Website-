import './globals.css'
import type { Metadata } from 'next'
import ThemeProvider from './components/ThemeProvider'
import ThemeToggle from './components/ThemeToggle'

export const metadata: Metadata = {
  title: 'Sustainability Dashboard',
  description: 'A modern web application for visualizing and analyzing sustainability-related data.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-white dark:bg-dark-bg text-gray-900 dark:text-dark-text transition-colors duration-200">
        <ThemeProvider>
          <div className="fixed top-4 right-4 z-50">
            <ThemeToggle />
          </div>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
} 