import React, { FunctionComponent, useMemo } from 'react'
import { CategoryListProps } from 'components/Main/CategoryList'
import Introduction from 'components/Main/Introduction'
import PostList from 'components/Main/PostList'
import { graphql, PageProps } from 'gatsby'
import queryString, { ParsedQuery } from 'query-string'
import Template from 'components/Common/Template'

const IndexPage: FunctionComponent<PageProps<Queries.IndexPageQuery>> = function ({
  location: { search },
  data: {
    allMarkdownRemark: { edges },
  },
}) {
  const parsed: ParsedQuery = queryString.parse(search)
  const selectedCategory: string = typeof parsed.category !== 'string' || !parsed.category ? 'All' : parsed.category

  // 카테고리 목록 생성 로직 수정
  const categoryList = useMemo(
    () =>
      edges.reduce(
        (list: CategoryListProps['categoryList'], cur) => {
          if (!cur?.node?.fields?.category) return list

          if (cur.node.fields.category) {
            if (!list[cur.node.fields.category]) {
              list[cur.node.fields.category] = 1
            } else {
              list[cur.node.fields.category] += 1
            }
          }

          list['All']++

          return list
        },
        { All: 0 },
      ),
    [edges],
  )

  return (
    <Template>
      <Introduction selectedCategory={selectedCategory} categoryList={categoryList} />
      {/*<CategoryList selectedCategory={selectedCategory} categoryList={categoryList} />*/}
      <PostList selectedCategory={selectedCategory} posts={edges} categoryList={categoryList} />
    </Template>
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
            categoryHierarchy
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
