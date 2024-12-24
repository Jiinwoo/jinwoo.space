import React, { FunctionComponent } from 'react'
import { graphql, PageProps } from 'gatsby'
import Template from 'components/Common/Template'
import PostHead from 'components/Post/PostHead'
import PostContent from 'components/Post/PostContent'
import CommentWidget from 'components/Post/CommentWidget'

function nonNullable<T>(value: T): value is NonNullable<T> {
  return value !== null && value !== undefined
}

const PostTemplate: FunctionComponent<PageProps<Queries.findMarkdownDataBySlugQuery>> = function ({
  data: {
    allMarkdownRemark: { edges },
    categories,
  },
}) {
  const {
    node: { html, fields, frontmatter },
  } = edges[0]

  const title = frontmatter?.title ?? ''
  const date = frontmatter?.date ?? ''
  const tags = (frontmatter?.tags ?? []).filter(nonNullable)

  const gatsbyImageData = frontmatter?.thumbnail?.childImageSharp?.gatsbyImageData

  // 카테고리 목록을 객체로 변환
  const categoryList = (categories.group ?? []).reduce(
    (acc, { fieldValue, totalCount }) => {
      if (fieldValue) {
        acc[fieldValue] = totalCount
        acc['All'] = (acc['All'] ?? 0) + totalCount
      }
      return acc
    },
    {} as Record<string, number>,
  )

  return (
    <Template>
      <PostHead
        title={title}
        date={date}
        tags={tags}
        thumbnail={gatsbyImageData}
        selectedCategory={fields?.category ?? 'All'}
        categoryList={categoryList}
      />
      <PostContent html={html ?? ''} selectedCategory={fields?.category ?? 'All'} categoryList={categoryList} />
      <CommentWidget />
    </Template>
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
    # 카테고리 목록을 가져오는 쿼리 추가
    categories: allMarkdownRemark {
      group(field: { fields: { category: SELECT } }) {
        fieldValue
        totalCount
      }
    }
  }
`
