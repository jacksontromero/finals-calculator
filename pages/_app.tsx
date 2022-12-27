import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { Box, createTheme, CssBaseline, PaletteMode } from '@mui/material'
import { ThemeProvider } from '@mui/material/styles';
import lightJSON from '../styles/light.json'
import darkJSON from '../styles/dark.json'
import { createContext, useMemo, useState } from 'react'

declare module '@mui/material/Button' {
  interface ButtonPropsVariantOverrides {
      elevated: true;
      filled: true;
      tonal: true;
  }
  interface ButtonPropsColorOverrides {
      tertiary: true;
      surface: true;
  }
}

declare module '@mui/material/Paper' {
  interface PaperPropsVariantOverrides {
      filled: true;
  }
}

declare module '@mui/material/Fab' {
  interface FabPropsVariantOverrides {
      primary: true;
      secondary: true;
      tertiary: true;
      surface: true;
  }
  interface FabPropsColorOverrides {
      tertiary: true,
      surface: true,
  }
}

export const ColorModeContext = createContext({ mode: "light" as PaletteMode, setMode: (x: PaletteMode) => { console.log("default") } });

export default function App({ Component, pageProps }: AppProps) {

  let lightTheme = createTheme(lightJSON as any);
  let darkTheme = createTheme(darkJSON as any);

  const [mode, setMode] = useState<PaletteMode>("light");

  const theme = useMemo(() => {
    return mode === "dark" ? lightTheme : darkTheme;
  }, [mode, lightTheme, darkTheme]);

  return (
    <Box sx={{minHeight: "100%"}}>
      <link rel="icon" type="image/svg" href="/test.svg"></link>
      <ColorModeContext.Provider value={{ mode, setMode }}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
            <Component {...pageProps} />
        </ThemeProvider>
      </ColorModeContext.Provider>
    </Box>
  )
}
