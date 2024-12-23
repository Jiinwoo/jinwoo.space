import React, { FunctionComponent, ReactNode } from 'react'
import styled from '@emotion/styled'
import GlobalStyle from 'components/Common/GlobalStyle'
import Footer from 'components/Common/Footer'
import { Helmet } from 'react-helmet'
import { graphql, useStaticQuery } from 'gatsby'

type TemplateProps = {
  children: ReactNode
}

const Template: FunctionComponent<TemplateProps> = function ({ children }) {
  const data = useStaticQuery<Queries.TemplateDataQuery>(graphql`
    query TemplateData {
      site {
        siteMetadata {
          title
          description
          siteUrl
        }
      }
      file(name: { eq: "profile-image" }) {
        publicURL
      }
    }
  `)

  const { title, description, siteUrl } = data.site?.siteMetadata ?? {}
  const { publicURL } = data.file ?? {}

  return (
    <Container>
      <Helmet>
        <title>{title}</title>

        <meta name="description" content={description ?? undefined} />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta httpEquiv="Content-Type" content="text/html;charset=UTF-8" />

        {/* Open Graph tags */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content={title ?? ''} />
        <meta property="og:description" content={description ?? ''} />
        <meta property="og:image" content={publicURL ?? ''} />
        <meta property="og:url" content={siteUrl ?? ''} />
        <meta property="og:site_name" content={title ?? ''} />

        {/* Twitter Card tags */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={title ?? ''} />
        <meta name="twitter:description" content={description ?? ''} />
        <meta name="twitter:image" content={publicURL ?? ''} />

        <html lang="ko" />
      </Helmet>
      <GlobalStyle />
      <main>{children}</main>
      <Footer />
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`

export default Template
