import '../styles/globals.css'
import type { AppProps } from 'next/app'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div>
      <link rel="icon" type="image/svg" href="/test.svg"></link>
      <Component {...pageProps} />
    </div>
  )
}
