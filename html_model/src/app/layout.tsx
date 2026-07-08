import type { ReactNode } from 'react'

import { Inter, Source_Serif_4, IBM_Plex_Mono } from 'next/font/google'
import type { Metadata } from 'next'

import { ThemeProvider } from '@/components/theme-provider'
import { TooltipProvider } from '@/components/ui/tooltip'

import { cn } from '@/lib/utils'

import './globals.css'

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin']
})

const sourceSerif4 = Source_Serif_4({
  variable: '--font-source-serif-4',
  subsets: ['latin']
})

const ibmPlexMono = IBM_Plex_Mono({
  variable: '--font-ibm-plex-mono',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700']
})

export const metadata: Metadata = {
  title: {
    template: '%s - Signal Lab',
    default: 'Signal Lab - 信号与系统三维仿真实验室'
  },
  description:
    '基于郑君里《信号与系统》教材的交互式信号分析计算器，提供卷积、傅里叶变换与 LTI 系统的 Three.js 三维动画可视化。',
  robots: 'index,follow',
  keywords: ['信号与系统', '傅里叶变换', '卷积', 'LTI', '仿真实验', 'Three.js'],
  icons: {
    icon: [
      {
        url: '/favicon/favicon-16x16.png',
        sizes: '16x16',
        type: 'image/png'
      },
      {
        url: '/favicon/favicon-32x32.png',
        sizes: '32x32',
        type: 'image/png'
      },
      {
        url: '/favicon/favicon.ico',
        sizes: '48x48',
        type: 'image/x-icon'
      }
    ],
    apple: [
      {
        url: '/favicon/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png'
      }
    ],
    other: [
      {
        url: '/favicon/android-chrome-192x192.png',
        rel: 'icon',
        sizes: '192x192',
        type: 'image/png'
      },
      {
        url: '/favicon/android-chrome-512x512.png',
        rel: 'icon',
        sizes: '512x512',
        type: 'image/png'
      }
    ]
  },
  metadataBase: new URL(`${process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'}`),
  openGraph: {
    title: {
      template: '%s - Signal Lab',
      default: 'Signal Lab - 信号与系统三维仿真实验室'
    },
    description:
      '基于郑君里《信号与系统》教材的交互式信号分析计算器，提供卷积、傅里叶变换与 LTI 系统的 Three.js 三维动画可视化。',
    type: 'website',
    siteName: 'Signal Lab',
    url: `${process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'}`,
    images: [
      {
        url: '/images/og-image.webp',
        type: 'image/png',
        width: 1200,
        height: 630,
        alt: 'Signal Lab - 信号与系统仿真实验室'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: {
      template: '%s - Signal Lab',
      default: 'Signal Lab - 信号与系统三维仿真实验室'
    },
    description:
      '基于郑君里《信号与系统》教材的交互式信号分析计算器，提供卷积、傅里叶变换与 LTI 系统的 Three.js 三维动画可视化。'
  }
}

const RootLayout = ({ children }: Readonly<{ children: ReactNode }>) => {
  return (
    <html
      lang='zh-CN'
      className={cn(
        inter.variable,
        sourceSerif4.variable,
        ibmPlexMono.variable,
        'flex min-h-full w-full scroll-smooth'
      )}
      suppressHydrationWarning
    >
      <body className='flex min-h-full w-full flex-auto flex-col'>
        <ThemeProvider attribute='class' enableSystem={false} disableTransitionOnChange>
          <TooltipProvider>{children}</TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

export default RootLayout
