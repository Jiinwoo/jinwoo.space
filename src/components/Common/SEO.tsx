import React from 'react'
import { Helmet } from 'react-helmet'
import { graphql, useStaticQuery } from 'gatsby'

interface SEOProps {
  title?: string | null
  description?: string | null
  imageUrl?: string | null
  article?: boolean | null
}

const SEO = ({ title, description, imageUrl, article }: SEOProps) => {
  const { site, file } = useStaticQuery<Queries.SEODataQuery>(graphql`
    query SEOData {
      site {
        siteMetadata {
          defaultTitle: title
          defaultDescription: description
          siteUrl
        }
      }
      file(name: { eq: "seo" }) {
        publicURL
      }
    }
  `)

  const seo = {
    title: title || site?.siteMetadata?.defaultTitle || '',
    description: description || site?.siteMetadata?.defaultDescription || '',
    imageUri: imageUrl
      ? `${site?.siteMetadata?.siteUrl}${imageUrl}`
      : `${site?.siteMetadata?.siteUrl}${file?.publicURL}`,
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
      {seo.imageUri && <meta property="og:image" content={seo.imageUri} />}
      <meta property="og:url" content={seo.url} />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={seo.title} />
      <meta name="twitter:description" content={seo.description} />
      {seo.imageUri && <meta name="twitter:image" content={seo.imageUri} />}
    </Helmet>
  )
}

export default SEO
