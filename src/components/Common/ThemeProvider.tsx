import React, { ReactNode } from 'react'
import { ThemeProvider as EmotionThemeProvider } from '@emotion/react'
import { theme } from '../../styles/theme'
import GlobalStyle from './GlobalStyle'

interface ThemeProviderProps {
  children: ReactNode
}

const ThemeProvider = ({ children }: ThemeProviderProps) => {
  return (
    <EmotionThemeProvider theme={theme}>
      <GlobalStyle />
      {children}
    </EmotionThemeProvider>
  )
}

export default ThemeProvider
