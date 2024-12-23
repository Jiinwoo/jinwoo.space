import React, { FunctionComponent } from 'react'
import styled from '@emotion/styled'
import PostItem from 'components/Main/PostItem'
import useInfiniteScroll from 'hooks/useInfiniteScroll'
import CategoryList, { CategoryListProps } from 'components/Main/CategoryList'

type PostListProps = {
  selectedCategory: string
  posts: Queries.IndexPageQuery['allMarkdownRemark']['edges']

  categoryList: CategoryListProps['categoryList']
}
const PostList: FunctionComponent<PostListProps> = function ({ posts, selectedCategory, categoryList }) {
  const { containerRef, postList } = useInfiniteScroll(selectedCategory, posts)
  console.log(postList)
  return (
    <Wrapper>
      <Aside>
        <CategoryList selectedCategory={selectedCategory} categoryList={categoryList} />
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
  width: 250px;
  padding-right: 40px;

  @media (max-width: 768px) {
    display: none; // 모바일에서 숨김
  }
`

const PostListWrapper = styled.article`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 24px;
  width: 768px;
  padding: 50px 0 100px;

  @media (max-width: 768px) {
    width: 100%; // 전체 너비 사용
    grid-template-columns: 1fr;
    padding: 30px 20px;
  }
`
export default PostList
