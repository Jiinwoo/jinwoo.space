import React, { FunctionComponent } from 'react'
import { graphql, PageProps } from 'gatsby'
import Layout from '@/components/common/Layout'
import PostHead from '@/components/Post/PostHead'
import PostContent from '@/components/Post/PostContent'
import CommentWidget from '@/components/Post/CommentWidget'
import SEO from '@/components/common/SEO'

function nonNullable<T>(value: T): value is NonNullable<T> {
  return value !== null && value !== undefined
}

const PostTemplate: FunctionComponent<PageProps<Queries.findMarkdownDataBySlugQuery>> = function ({
  data: {
    allMarkdownRemark: { edges },
  },
}) {
  const {
    node: { html, fields, frontmatter },
  } = edges[0]

  const title = frontmatter?.title ?? ''
  const date = frontmatter?.date ?? ''
  const tags = (frontmatter?.tags ?? []).filter(nonNullable)

  const gatsbyImageData = frontmatter?.thumbnail?.childImageSharp?.gatsbyImageData

  return (
    <Layout>
      <SEO
        title={frontmatter?.title}
        description={frontmatter?.summary}
        article={true}
        imageUrl={frontmatter?.thumbnail?.publicURL}
      />
      <PostHead
        title={title}
        date={date}
        tags={tags}
        thumbnail={gatsbyImageData}
        selectedCategory={fields?.category ?? 'All'}
      />
      <PostContent html={html ?? ''} selectedCategory={fields?.category ?? 'All'} />
      <CommentWidget />
    </Layout>
  )
}

export default PostTemplate

export const findMarkdownDataBySlugQuery = graphql`
  query findMarkdownDataBySlug($slug: String) {
    allMarkdownRemark(filter: { fields: { slug: { eq: $slug } } }) {
      edges {
        node {
          html
          fields {
            category
          }
          frontmatter {
            title
            summary
            date(formatString: "YYYY.MM.DD.")
            tags
            thumbnail {
              childImageSharp {
                gatsbyImageData
              }
              publicURL
            }
          }
        }
      }
    }
  }
`
