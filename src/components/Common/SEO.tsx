import React from 'react'
import { Helmet } from 'react-helmet'
import { graphql, useStaticQuery } from 'gatsby'

interface SEOProps {
  title?: string
  description?: string
  image?: string
  article?: boolean
}

const SEO = ({ title, description, image, article }: SEOProps) => {
  const { site } = useStaticQuery<Queries.SEODataQuery>(graphql`
    query SEOData {
      site {
        siteMetadata {
          defaultTitle: title
          defaultDescription: description
          siteUrl
        }
      }
    }
  `)

  const seo = {
    title: title || site?.siteMetadata?.defaultTitle || '',
    description: description || site?.siteMetadata?.defaultDescription || '',
    image: image ? `${site?.siteMetadata?.siteUrl}${image}` : null,
    url: site?.siteMetadata?.siteUrl || '',
  }

  return (
    <Helmet title={seo.title}>
      <html lang="ko" />
      <meta name="description" content={seo.description} />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />

      {/* Open Graph */}
      <meta property="og:type" content={article ? 'article' : 'website'} />
      <meta property="og:title" content={seo.title} />
      <meta property="og:description" content={seo.description} />
      {seo.image && <meta property="og:image" content={seo.image} />}
      <meta property="og:url" content={seo.url} />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={seo.title} />
      <meta name="twitter:description" content={seo.description} />
      {seo.image && <meta name="twitter:image" content={seo.image} />}
    </Helmet>
  )
}

export default SEO
