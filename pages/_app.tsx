import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { ThemeProvider } from '@emotion/react'
import { createTheme } from '@mui/material'
import themeJSON from '../styles/theme.json'

export default function App({ Component, pageProps }: AppProps) {
  const theme = createTheme(themeJSON as any);

  return (
    <div>
      <link rel="icon" type="image/svg" href="/test.svg"></link>
      <ThemeProvider theme={theme}>
        <Component {...pageProps} />
      </ThemeProvider>
    </div>
  )
}
