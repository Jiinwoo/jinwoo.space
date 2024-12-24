/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: <https://www.gatsbyjs.com/docs/node-apis/>
 */

// You can delete this file if you're not using it

const path = require('path')
const { createFilePath } = require(`gatsby-source-filesystem`)

// Setup Import Alias
exports.onCreateWebpackConfig = ({ getConfig, actions }) => {
  const output = getConfig().output || {}

  actions.setWebpackConfig({
    output,
    resolve: {
      alias: {
        components: path.resolve(__dirname, 'src/components'),
        utils: path.resolve(__dirname, 'src/utils'),
        hooks: path.resolve(__dirname, 'src/hooks'),
      },
    },
  })
}

// Generate a Slug Each Post Data
exports.onCreateNode = ({ node, getNode, actions }) => {
  const { createNodeField } = actions

  if (node.internal.type === `MarkdownRemark`) {
    const parent = getNode(node.parent)

    const relativeDirectory = parent.relativeDirectory

    const isIndexFile = parent.name === 'index'

    // URL 경로 생성을 위한 함수
    const createUrlPath = path => {
      return path
        .split('/')
        .map(segment => {
          // 1. 공백을 하이픈으로 변경
          // 2. 괄호는 그대로 유지
          // 3. 특수문자는 유지하되 URL safe하게 처리
          return segment
            .replace(/ /g, '-')
            .replace(/[^a-zA-Z0-9가-힣\-_()]/g, '')
            .replace(/--+/g, '-') // 연속된 하이픈을 하나로
            .replace(/^-|-$/g, '') // 시작과 끝의 하이픈 제거
        })
        .join('/')
    }

    // slug 생성 부분 수정
    let slug

    if (isIndexFile) {
      slug = '/' + createUrlPath(relativeDirectory)
    } else {
      const originalSlug = createFilePath({ node, getNode })
      slug = createUrlPath(originalSlug)
    }

    const category = relativeDirectory.split('/')[0]

    createNodeField({
      node,
      name: 'category',
      value: category,
    })

    // Add custom fields
    createNodeField({
      node,
      name: 'slug',
      value: slug,
    })
  }
}

// Generate Post Page Through Markdown Data
exports.createPages = async ({ actions, graphql, reporter }) => {
  const { createPage } = actions

  const result = await graphql(`
    {
      posts: allMarkdownRemark(sort: { order: DESC, fields: [frontmatter___date, frontmatter___title] }) {
        edges {
          node {
            fields {
              slug
              category
            }

            frontmatter {
              draft
            }
          }
        }
      }
    }
  `)

  if (result.errors) {
    reporter.panicOnBuild(`Error while running GraphQL query.`)
    return
  }

  const isDevelopment = process.env.NODE_ENV === 'development'

  // Create post pages
  const PostTemplateComponent = path.resolve(__dirname, 'src/templates/post_template.tsx')

  result.data.posts.edges.forEach(({ node }) => {
    if (isDevelopment || !node.frontmatter.draft) {
      createPage({
        path: node.fields.slug,
        component: PostTemplateComponent,
        context: {
          slug: node.fields.slug,
          category: node.fields.category,
        },
      })
    }
  })
}
