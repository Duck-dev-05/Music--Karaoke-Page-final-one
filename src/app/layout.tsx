import './globals.css'
import './animations.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Providers } from '@/providers'
import ClientNavbarWrapper from '@/components/ClientNavbarWrapper'
import { MobileNav } from '@/components/MobileNav'
import { Toaster } from 'sonner'
import { Toaster as ReactHotToastToaster } from "react-hot-toast";

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Karaoke Music',
  description: 'Your favorite karaoke platform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <div className="min-h-screen bg-background pb-[80px] md:pb-0">
            <ClientNavbarWrapper />
            <main>{children}</main>
            <MobileNav />
          </div>
          <Toaster />
          <ReactHotToastToaster />
        </Providers>
      </body>
    </html>
  )
}
