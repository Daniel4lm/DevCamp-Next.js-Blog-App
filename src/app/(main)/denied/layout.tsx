import '@/app/globals.css'
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], display: 'swap' })

export const metadata = {
  title: 'Not found'
}

export async function generateStaticParams() {
  return []
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <section className={inter.className}>
      {children}
    </section>
  )
}
