import React from 'react'

import Introduction from '@/components/Main/Introduction'
import PostList from '@/components/Main/PostList'
import { graphql, PageProps } from 'gatsby'
import queryString, { ParsedQuery } from 'query-string'
import Layout from '@/components/common/Layout'
import SEO from '@/components/common/SEO'

const IndexPage = function ({
  location: { search },
  data: {
    allMarkdownRemark: { edges },
    site,
  },
}: PageProps<Queries.IndexPageQuery>) {
  const parsed: ParsedQuery = queryString.parse(search)
  const selectedCategory: string = typeof parsed.category !== 'string' || !parsed.category ? 'All' : parsed.category

  return (
    <Layout>
      <SEO
        title={site?.siteMetadata?.title}
        description={site?.siteMetadata?.description}
        imageUrl="/og-image.jpg" // 대표 이미지 설정
      />
      <Introduction selectedCategory={selectedCategory} />
      <PostList selectedCategory={selectedCategory} posts={edges} />
    </Layout>
  )
}

// GraphQL 쿼리 수정
export const getPostList = graphql`
  query IndexPage {
    site {
      siteMetadata {
        title
        description
        siteUrl
      }
    }
    allMarkdownRemark(
      filter: { fields: { shouldShow: { eq: true } } }
      sort: { order: DESC, fields: [frontmatter___date, frontmatter___title] }
    ) {
      edges {
        node {
          id
          fields {
            slug
            category
          }
          frontmatter {
            title
            summary
            date(formatString: "YYYY.MM.DD.")
            thumbnail {
              childImageSharp {
                gatsbyImageData(width: 768, height: 400)
              }
            }
            draft
          }
        }
      }
    }
  }
`
export default IndexPage
