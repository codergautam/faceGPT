import { SessionProvider } from "next-auth/react"
import { Inter } from 'next/font/google'
const inter = Inter({ subsets: ['latin'] })
export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  return (
    <SessionProvider session={session}>
      <style jsx global>{`
        html {
          font-family: ${inter.style.fontFamily};
        }
        body {
          margin: 0;
        }
      `}</style>
      <Component {...pageProps} />
    </SessionProvider>
  )
}