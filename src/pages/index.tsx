import React from 'react'

import Introduction from 'components/Main/Introduction'
import PostList from 'components/Main/PostList'
import { graphql, PageProps } from 'gatsby'
import queryString, { ParsedQuery } from 'query-string'
import Layout from 'components/common/Layout'

const IndexPage = function ({
  location: { search },
  data: {
    allMarkdownRemark: { edges },
  },
}: PageProps<Queries.IndexPageQuery>) {
  const parsed: ParsedQuery = queryString.parse(search)
  const selectedCategory: string = typeof parsed.category !== 'string' || !parsed.category ? 'All' : parsed.category

  return (
    <Layout>
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
      filter: { frontmatter: { draft: { in: [null, false] } } }
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
