import React, { FunctionComponent } from 'react'
import styled from '@emotion/styled'
import { css, Theme } from '@emotion/react'
import TableOfContents from '@/components/Post/TableOfContents'
import CategoryList from '@/components/common/CategoryList'

interface PostContentProps {
  html: string
  selectedCategory: string
}

const PostContent: FunctionComponent<PostContentProps> = function ({ html, selectedCategory }) {
  return (
    <Container>
      <Aside>
        <CategoryList selectedCategory={selectedCategory} variant={'sidebar'} />
      </Aside>
      <ContentWrapper>
        <MarkdownContainer className="markdown-container" dangerouslySetInnerHTML={{ __html: html }} />
      </ContentWrapper>
      <TableOfContents contentSelector=".markdown-container" />
    </Container>
  )
}

const globalStyles = ({ theme }: { theme: Theme }) => css`
  img {
    max-width: 100%;
    height: auto;
    border-radius: ${theme.borderRadius.medium};
    margin: ${theme.spacing[4]} 0;
    box-shadow: ${theme.shadows.md};

    ${theme.mediaQueries.tablet} {
      border-radius: ${theme.borderRadius.large};
      margin: ${theme.spacing[6]} 0;
    }
  }

  code {
    background-color: ${theme.colors.background.dark};
    padding: ${theme.spacing[1]} ${theme.spacing[2]};
    border-radius: ${theme.borderRadius.small};
    font-size: ${theme.typography.body.small.fontSize};
    font-family: 'JetBrains Mono', 'Fira Code', 'Consolas', monospace;
    color: ${theme.colors.text.inverse};

    ${theme.mediaQueries.tablet} {
      font-size: ${theme.typography.body.normal.fontSize};
    }
  }

  pre {
    background-color: ${theme.colors.background.secondary};
    padding: ${theme.spacing[4]};
    border-radius: ${theme.borderRadius.medium};
    overflow-x: auto;
    margin: ${theme.spacing[4]} 0;
    border: 1px solid ${theme.colors.border.light};

    ${theme.mediaQueries.tablet} {
      padding: ${theme.spacing[6]};
      border-radius: ${theme.borderRadius.large};
      margin: ${theme.spacing[6]} 0;
    }

    code {
      background-color: transparent;
      padding: 0;
      font-size: ${theme.typography.body.small.fontSize};
      line-height: 1.6;

      ${theme.mediaQueries.tablet} {
        font-size: ${theme.typography.body.normal.fontSize};
        line-height: 1.7;
      }
    }
  }
`

const Container = styled.div`
  width: 100%;
  margin: 0 auto;
  max-width: 1200px;
  position: relative;
  display: flex;
  overflow-x: auto;
`

const Aside = styled.aside`
  min-width: 216px;
  width: 216px;
  flex-shrink: 0;

  ${({ theme }) => theme.mediaQueries.tablet} {
    display: block;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    display: none;
  }
`

const ContentWrapper = styled.div`
  position: relative;

  display: flex;
  justify-content: center;
  flex-shrink: 0;

  width: 100%;
  padding: ${({ theme }) => theme.spacing[4]};

  ${({ theme }) => theme.mediaQueries.tablet} {
    width: 768px;
    padding: 0;
  }
`

const MarkdownContainer = styled.div`
  ${globalStyles};

  width: 100%;
  font-size: ${({ theme }) => theme.typography.body.normal.fontSize};
  line-height: ${({ theme }) => theme.typography.body.normal.lineHeight};
  color: ${({ theme }) => theme.colors.text.primary};
  word-break: keep-all;
  overflow-wrap: break-word;

  ${({ theme }) => theme.mediaQueries.tablet} {
    line-height: 1.8;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    margin: ${({ theme }) => `${theme.spacing[8]} 0 ${theme.spacing[4]}`};
    font-weight: 700;
    line-height: 1.3;
    color: ${({ theme }) => theme.colors.text.primary};

    ${({ theme }) => theme.mediaQueries.tablet} {
      margin: ${({ theme }) => `${theme.spacing[10]} 0 ${theme.spacing[6]}`};
    }
  }

  h1 {
    font-size: ${({ theme }) => theme.typography.heading.h1.mobile.fontSize};
    letter-spacing: -0.02em;

    ${({ theme }) => theme.mediaQueries.tablet} {
      font-size: ${({ theme }) => theme.typography.heading.h1.fontSize};
    }
  }

  h2 {
    font-size: ${({ theme }) => theme.typography.heading.h2.mobile.fontSize};
    letter-spacing: -0.01em;

    ${({ theme }) => theme.mediaQueries.tablet} {
      font-size: ${({ theme }) => theme.typography.heading.h2.fontSize};
    }
  }

  h3 {
    font-size: ${({ theme }) => theme.typography.heading.h3.mobile.fontSize};

    ${({ theme }) => theme.mediaQueries.tablet} {
      font-size: ${({ theme }) => theme.typography.heading.h3.fontSize};
    }
  }

  p {
    margin: ${({ theme }) => `${theme.spacing[4]} 0`};
    line-height: ${({ theme }) => theme.typography.body.normal.lineHeight};
    font-size: ${({ theme }) => theme.typography.body.small.fontSize};
    letter-spacing: -0.003em;

    ${({ theme }) => theme.mediaQueries.tablet} {
      margin: ${({ theme }) => `${theme.spacing[6]} 0`};
      line-height: 1.8;
      font-size: ${({ theme }) => theme.typography.body.normal.fontSize};
    }
  }

  a {
    color: ${({ theme }) => theme.colors.primary.light};
    text-decoration: none;
    transition: all 0.2s ease;
    border-bottom: 1px solid transparent;

    &:hover {
      color: ${({ theme }) => theme.colors.primary.dark};
      border-bottom-color: currentColor;
    }

    &:focus {
      outline: 2px solid ${({ theme }) => theme.colors.interactive.focus};
      outline-offset: 2px;
    }
  }

  ul,
  ol {
    padding-left: ${({ theme }) => theme.spacing[5]};
    margin: ${({ theme }) => theme.spacing[4]} 0;

    ${({ theme }) => theme.mediaQueries.tablet} {
      padding-left: ${({ theme }) => theme.spacing[8]};
      margin: ${({ theme }) => theme.spacing[6]} 0;
    }

    ul,
    ol {
      margin: ${({ theme }) => theme.spacing[2]} 0;

      ${({ theme }) => theme.mediaQueries.tablet} {
        margin: ${({ theme }) => theme.spacing[3]} 0;
      }
    }
  }

  li {
    margin: ${({ theme }) => theme.spacing[2]} 0;
    padding-left: ${({ theme }) => theme.spacing[1]};
    line-height: ${({ theme }) => theme.typography.body.normal.lineHeight};

    ${({ theme }) => theme.mediaQueries.tablet} {
      margin: ${({ theme }) => theme.spacing[3]} 0;
      line-height: 1.8;
    }
  }

  blockquote {
    margin: ${({ theme }) => theme.spacing[6]} 0;
    padding: ${({ theme }) => `${theme.spacing[3]} ${theme.spacing[4]}`};
    border-left: 3px solid ${({ theme }) => theme.colors.primary.light};
    background-color: ${({ theme }) => theme.colors.background.secondary};
    font-style: italic;
    color: ${({ theme }) => theme.colors.text.secondary};
    border-radius: 0 ${({ theme }) => theme.borderRadius.medium} ${({ theme }) => theme.borderRadius.medium} 0;
    font-size: ${({ theme }) => theme.typography.body.small.fontSize};

    ${({ theme }) => theme.mediaQueries.tablet} {
      margin: ${({ theme }) => theme.spacing[8]} 0;
      padding: ${({ theme }) => `${theme.spacing[4]} ${theme.spacing[6]}`};
      border-left: 4px solid ${({ theme }) => theme.colors.primary.light};
      border-radius: 0 ${({ theme }) => theme.borderRadius.large} ${({ theme }) => theme.borderRadius.large} 0;
      font-size: ${({ theme }) => theme.typography.body.normal.fontSize};
    }

    p {
      margin: ${({ theme }) => theme.spacing[2]} 0;

      ${({ theme }) => theme.mediaQueries.tablet} {
        margin: ${({ theme }) => theme.spacing[3]} 0;
      }
    }
  }

  table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;
    margin: ${({ theme }) => theme.spacing[6]} 0;
    overflow-x: auto;
    border-radius: ${({ theme }) => theme.borderRadius.medium};
    border: 1px solid ${({ theme }) => theme.colors.border.light};
    font-size: ${({ theme }) => theme.typography.body.small.fontSize};
    -webkit-overflow-scrolling: touch;
    scrollbar-width: thin;

    ${({ theme }) => theme.mediaQueries.tablet} {
      margin: ${({ theme }) => theme.spacing[8]} 0;
      font-size: ${({ theme }) => theme.typography.body.normal.fontSize};
      border-radius: ${({ theme }) => theme.borderRadius.large};
    }

    &::-webkit-scrollbar {
      height: 6px;
    }

    &::-webkit-scrollbar-thumb {
      background-color: ${({ theme }) => theme.colors.border.normal};
      border-radius: 3px;
    }
  }

  th {
    background-color: ${({ theme }) => theme.colors.background.secondary};
    font-weight: 600;
    white-space: nowrap;
    padding: ${({ theme }) => `${theme.spacing[2]} ${theme.spacing[3]}`};

    ${({ theme }) => theme.mediaQueries.tablet} {
      padding: ${({ theme }) => `${theme.spacing[3]} ${theme.spacing[4]}`};
    }
  }

  td {
    padding: ${({ theme }) => `${theme.spacing[2]} ${theme.spacing[3]}`};
    word-break: break-word;
    border: 1px solid ${({ theme }) => theme.colors.border.light};

    ${({ theme }) => theme.mediaQueries.tablet} {
      padding: ${({ theme }) => `${theme.spacing[3]} ${theme.spacing[4]}`};
    }
  }

  tr:hover {
    background-color: ${({ theme }) => theme.colors.background.secondary};
  }

  hr {
    border: none;
    border-top: 1px solid ${({ theme }) => theme.colors.border.light};
    margin: ${({ theme }) => theme.spacing[8]} 0;

    ${({ theme }) => theme.mediaQueries.tablet} {
      border-top: 2px solid ${({ theme }) => theme.colors.border.light};
      margin: ${({ theme }) => theme.spacing[12]} 0;
    }
  }
`

export default PostContent
