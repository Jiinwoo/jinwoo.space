import React, { ReactNode } from 'react'
import styled from '@emotion/styled'
import Footer from '@/components/common/Footer'
import SEO from '@/components/common/SEO'
import ThemeProvider from '@/components/common/ThemeProvider'

type LayoutProps = {
  children: ReactNode
}

const Layout = function ({ children }: LayoutProps) {
  return (
    <ThemeProvider>
      <Container>
        <SEO /> {/* 기본 SEO */}
        <main>{children}</main>
        <Footer />
      </Container>
    </ThemeProvider>
  )
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`

export default Layout
