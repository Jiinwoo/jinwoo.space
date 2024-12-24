import React, { FunctionComponent } from 'react'
import styled from '@emotion/styled'
import { css } from '@emotion/react'
import TableOfContents from 'components/Post/TableOfContents'
import CategoryList, { CategoryListProps } from 'components/Main/CategoryList'

interface PostContentProps {
  html: string
  selectedCategory: string
  categoryList: CategoryListProps['categoryList']
}

const PostContent: FunctionComponent<PostContentProps> = function ({ html, selectedCategory, categoryList }) {
  return (
    <Container>
      <Aside>
        <CategoryList selectedCategory={selectedCategory} categoryList={categoryList} />
      </Aside>
      <ContentWrapper>
        <MarkdownContainer className="markdown-container" dangerouslySetInnerHTML={{ __html: html }} />
      </ContentWrapper>
      <TableOfContents contentSelector=".markdown-container" />
    </Container>
  )
}

const breakpoints = {
  mobile: '320px',
  tablet: '768px',
  desktop: '1024px',
}

const media = {
  mobile: `@media (min-width: ${breakpoints.mobile})`,
  tablet: `@media (min-width: ${breakpoints.tablet})`,
  desktop: `@media (min-width: ${breakpoints.desktop})`,
}

const globalStyles = css`
  img {
    max-width: 100%;
    height: auto;
    border-radius: 6px;
    margin: 1rem 0;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

    ${media.tablet} {
      border-radius: 8px;
      margin: 1.5rem 0;
    }
  }

  code {
    background-color: #24292e;
    padding: 0.2em 0.4em;
    border-radius: 4px;
    font-size: 0.85em;
    font-family: 'JetBrains Mono', 'Fira Code', 'Consolas', monospace;
    color: #f6f8fa;

    ${media.tablet} {
      font-size: 0.9em;
    }
  }

  pre {
    background-color: #f6f8fa;
    padding: 1rem;
    border-radius: 6px;
    overflow-x: auto;
    margin: 1rem 0;
    border: 1px solid #e1e4e8;

    ${media.tablet} {
      padding: 1.5rem;
      border-radius: 8px;
      margin: 1.5rem 0;
    }

    code {
      background-color: transparent;
      padding: 0;
      font-size: 0.85em;
      line-height: 1.6;

      ${media.tablet} {
        font-size: 0.95em;
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

  //padding-right: 10px;
  //position: absolute;
  //top: 0;
  //left: -250px;
  flex-shrink: 0;

  @media (max-width: 768px) {
    display: none; // 모바일에서 숨김
  }
`

const ContentWrapper = styled.div`
  display: flex;
  justify-content: center;
  position: relative;
  padding: 1rem;
  max-width: 768px;
  width: 768px; // 추가
  flex-shrink: 0;

  // ${media.mobile} {
  //   padding: 1rem;
  // }
  //
  // ${media.tablet} {
  //   padding: 2rem;
  // }
  //
  // ${media.desktop} {
  //   padding: 0;
  // }
`

const MarkdownContainer = styled.div`
  ${globalStyles}

  width: 100%;
  font-size: 16px;
  line-height: 1.6;
  color: #2d3748;
  word-break: keep-all;
  overflow-wrap: break-word;

  ${media.tablet} {
    line-height: 1.8;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    margin: 2rem 0 1rem;
    font-weight: 700;
    line-height: 1.3;
    color: #1a202c;

    ${media.tablet} {
      margin: 2.5rem 0 1.5rem;
    }
  }

  h1 {
    font-size: 1.75em;
    letter-spacing: -0.02em;

    ${media.tablet} {
      font-size: 2.25em;
    }

    ${media.desktop} {
      font-size: 2.5em;
    }
  }

  h2 {
    font-size: 1.5em;
    letter-spacing: -0.01em;

    ${media.tablet} {
      font-size: 1.75em;
    }

    ${media.desktop} {
      font-size: 2em;
    }
  }

  h3 {
    font-size: 1.25em;

    ${media.tablet} {
      font-size: 1.5em;
    }
  }

  p {
    margin: 1rem 0;
    line-height: 1.6;
    font-size: 0.95em;
    letter-spacing: -0.003em;

    ${media.tablet} {
      margin: 1.5rem 0;
      line-height: 1.8;
      font-size: 1em;
    }
  }

  a {
    color: #4a9eff;
    text-decoration: none;
    transition: all 0.2s ease;
    border-bottom: 1px solid transparent;

    &:hover {
      color: #1778ff;
      border-bottom-color: currentColor;
    }

    &:focus {
      outline: 2px solid #4a9eff;
      outline-offset: 2px;
    }
  }

  ul,
  ol {
    padding-left: 1.2rem;
    margin: 1rem 0;

    ${media.tablet} {
      padding-left: 1.8rem;
      margin: 1.5rem 0;
    }

    ul,
    ol {
      margin: 0.5rem 0;

      ${media.tablet} {
        margin: 0.75rem 0;
      }
    }
  }

  li {
    margin: 0.5rem 0;
    padding-left: 0.2rem;
    line-height: 1.6;

    ${media.tablet} {
      margin: 0.75rem 0;
      line-height: 1.8;
    }
  }

  blockquote {
    margin: 1.5rem 0;
    padding: 0.75rem 1rem;
    border-left: 3px solid #4a9eff;
    background-color: #f8fafc;
    font-style: italic;
    color: #4a5568;
    border-radius: 0 6px 6px 0;
    font-size: 0.95em;

    ${media.tablet} {
      margin: 2rem 0;
      padding: 1rem 1.5rem;
      border-left: 4px solid #4a9eff;
      border-radius: 0 8px 8px 0;
      font-size: 1em;
    }

    p {
      margin: 0.5rem 0;

      ${media.tablet} {
        margin: 0.75rem 0;
      }
    }
  }

  table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;
    margin: 1.5rem 0;
    overflow-x: auto;
    border-radius: 6px;
    border: 1px solid #e2e8f0;
    font-size: 0.9em;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: thin;

    ${media.tablet} {
      margin: 2rem 0;
      font-size: 1em;
      border-radius: 8px;
    }

    &::-webkit-scrollbar {
      height: 6px;
    }

    &::-webkit-scrollbar-thumb {
      background-color: #cbd5e0;
      border-radius: 3px;
    }
  }

  th {
    background-color: #f8fafc;
    font-weight: 600;
    white-space: nowrap;
    padding: 0.5rem 0.75rem;

    ${media.tablet} {
      padding: 0.75rem 1rem;
    }
  }

  td {
    padding: 0.5rem 0.75rem;
    word-break: break-word;
    border: 1px solid #e2e8f0;

    ${media.tablet} {
      padding: 0.75rem 1rem;
    }
  }

  tr:hover {
    background-color: #f8fafc;
  }

  hr {
    border: none;
    border-top: 1px solid #edf2f7;
    margin: 2rem 0;

    ${media.tablet} {
      border-top: 2px solid #edf2f7;
      margin: 3rem 0;
    }
  }
`

export default PostContent
