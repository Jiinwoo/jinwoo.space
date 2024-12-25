import React, { FunctionComponent } from 'react'
import styled from '@emotion/styled'
import PostItem from 'components/Main/PostItem'
import useInfiniteScroll from 'hooks/useInfiniteScroll'
import CategoryList from 'components/common/CategoryList'

type PostListProps = {
  posts: Queries.IndexPageQuery['allMarkdownRemark']['edges']
  selectedCategory: string
}
const PostList: FunctionComponent<PostListProps> = function ({ posts, selectedCategory }) {
  const { containerRef, postList } = useInfiniteScroll(selectedCategory, posts)
  return (
    <Wrapper>
      <Aside>
        <CategoryList selectedCategory={selectedCategory} variant={'sidebar'} />
      </Aside>
      <PostListWrapper ref={containerRef}>
        {postList.map(({ node: { id, frontmatter, fields } }) => (
          <PostItem
            key={id}
            title={frontmatter?.title ?? ''}
            date={frontmatter?.date ?? ''}
            summary={frontmatter?.summary ?? ''}
            thumbnail={frontmatter?.thumbnail ?? null}
            link={fields?.slug ?? ''}
          />
        ))}
      </PostListWrapper>
    </Wrapper>
  )
}
const Wrapper = styled.div`
  display: flex;
  max-width: 1200px;
  margin: 0 auto;
`

const Aside = styled.aside`
  width: 216px;

  @media (max-width: 768px) {
    display: none; // 모바일에서 숨김
  }
`

const PostListWrapper = styled.article`
  display: grid;
  grid-gap: 24px;

  width: 100%; // 전체 너비 사용
  grid-template-columns: 1fr;
  padding: 30px 20px;

  ${({ theme }) => theme.mediaQueries.tablet} {
    grid-template-columns: repeat(2, 1fr);
    width: 768px;
    padding: 16px 0 100px;
  }
`
export default PostList
