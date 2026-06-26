import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'HAMKORON — Усто ва кор ёфтан бо мо осон!',
  description: 'Платформа барои пайдо кардани устоҳо ва ҷойи кор дар Тоҷикистон. Найдите мастеров и работу в Таджикистане.',
  keywords: 'усто, кор, Тоҷикистон, барқкаш, сантехник, бинокор, мастер, работа',
  openGraph: {
    title: 'HAMKORON',
    description: 'Усто ва кор ёфтан бо мо осон!',
    type: 'website',
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tg">
      <body>{children}</body>
    </html>
  )
}
