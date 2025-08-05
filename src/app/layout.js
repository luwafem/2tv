import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: '2TV - Premium IPTV Service',
  description: 'Access thousands of channels with our premium IPTV service. Multiple plans available.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <script src="https://js.paystack.co/v1/inline.js"></script>
      </head>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}
