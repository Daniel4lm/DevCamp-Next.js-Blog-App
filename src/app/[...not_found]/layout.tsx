import '@/app/styles/globals.css'

export const metadata = {
  title: 'Not found'
}

export async function generateStaticParams() {
  return []
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="">{children}</body>
    </html>
  )
}
