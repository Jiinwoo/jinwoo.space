import { IGatsbyImageData } from 'gatsby-plugin-image'

export type PostFrontmatterType = {
  title: string
  date: string
  categories: string[]
  summary: string
  thumbnail: {
    childImageSharp: {
      gatsbyImageData: IGatsbyImageData
    }
    publicURL: string
  }
  draft?: string | null
}

export type PostListItemType = {
  node: {
    id: string
    fields: {
      slug: string
      draft?: string
    }
    frontmatter: PostFrontmatterType
  }
}
