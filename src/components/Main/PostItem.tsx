import React, { FunctionComponent } from 'react'
import styled from '@emotion/styled'
import { Link } from 'gatsby'
import { GatsbyImage, IGatsbyImageData } from 'gatsby-plugin-image'

interface PostItemProps {
  title: string
  date: string
  // categories: string[]
  summary: string
  thumbnail: {
    childImageSharp: {
      gatsbyImageData: IGatsbyImageData
    } | null
  } | null
  link: string
}

const PostItem: FunctionComponent<PostItemProps> = function ({ title, date, summary, thumbnail, link }) {
  return (
    <PostItemWrapper to={link}>
      {thumbnail?.childImageSharp?.gatsbyImageData && (
        <ThumbnailImage image={thumbnail?.childImageSharp.gatsbyImageData} alt="Post Item Image" />
      )}

      <PostItemContent>
        <Title>{title}</Title>
        <Date>{date}</Date>
        {/*<Category>*/}
        {/*  {categories.map(category => (*/}
        {/*    <CategoryItem key={category}>{category}</CategoryItem>*/}
        {/*  ))}*/}
        {/*</Category>*/}
        <Summary>{summary}</Summary>
      </PostItemContent>
    </PostItemWrapper>
  )
}

const PostItemWrapper = styled(Link)`
  display: flex;
  flex-direction: column;
  border-radius: 10px;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.15);
  transition: 0.3s box-shadow;
  cursor: pointer;

  &:hover {
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  }
`

const ThumbnailImage = styled(GatsbyImage)`
  width: 100%;
  height: 200px;
  border-radius: 10px 10px 0 0;
`
const PostItemContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 15px;
`

const Title = styled.div`
  display: -webkit-box;
  overflow: hidden;
  margin-bottom: 3px;
  text-overflow: ellipsis;
  white-space: normal;
  overflow-wrap: break-word;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  font-size: 20px;
  font-weight: 700;
`

const Date = styled.div`
  font-size: 14px;
  font-weight: 400;
  opacity: 0.7;
`

const Summary = styled.div`
  display: -webkit-box;
  overflow: hidden;
  margin-top: auto;
  text-overflow: ellipsis;
  white-space: normal;
  overflow-wrap: break-word;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  font-size: 16px;
  opacity: 0.8;
`

export default PostItem
