/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: <https://www.gatsbyjs.com/docs/node-apis/>
 */

// You can delete this file if you're not using it

const path = require('path')
const { createFilePath } = require(`gatsby-source-filesystem`)

// console.log(process.env.NODE_ENV, 'env')

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

    // 디버깅을 위한 로그 추가
    console.log('File path:', parent.absolutePath)
    console.log('Relative directory before:', parent.relativeDirectory)

    let relativeDirectory = parent.relativeDirectory

    const isIndexFile = parent.name === 'index'

    // isIndexFile인 경우 상위 디렉토리를 카테고리로 사용
    if (isIndexFile && relativeDirectory.includes('/')) {
      relativeDirectory = relativeDirectory.split('/').slice(0, -1).join('/')
    }

    console.log('Is index file:', isIndexFile)
    console.log('Relative directory after:', relativeDirectory)

    // 카테고리 계층 생성
    const categoryHierarchy = relativeDirectory.split('/').filter(Boolean)

    console.log(categoryHierarchy)

    // slug 생성?
    const slug = isIndexFile ? `/${relativeDirectory}` : createFilePath({ node, getNode })

    // Add custom fields
    createNodeField({
      node,
      name: 'slug',
      value: slug,
    })

    createNodeField({
      node,
      name: 'categoryHierarchy',
      value: categoryHierarchy,
    })

    createNodeField({
      node,
      name: 'category',
      value: relativeDirectory,
    })

    createNodeField({
      node,
      name: 'isDirectoryPost',
      value: isIndexFile,
    })

    if (isIndexFile) {
      createNodeField({
        node,
        name: 'directoryPath',
        value: relativeDirectory,
      })
    }
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
              categoryHierarchy
              isDirectoryPost
              directoryPath
            }
            frontmatter {
              draft
            }
          }
        }
      }
      categories: allMarkdownRemark {
        group(field: { fields: { category: SELECT } }) {
          fieldValue
          totalCount
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
          categoryHierarchy: node.fields.categoryHierarchy,
          // Pass directory info for image handling
          isDirectoryPost: node.fields.isDirectoryPost,
          directoryPath: node.fields.directoryPath,
        },
      })
    }
  })
}
