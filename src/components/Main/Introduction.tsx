import React, { useState } from 'react'
import styled from '@emotion/styled'
import { graphql, useStaticQuery } from 'gatsby'
import { GatsbyImage } from 'gatsby-plugin-image'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from '@fortawesome/free-solid-svg-icons'
import CategoryList from 'components/Main/CategoryList'
import { CategoryListProps } from '../../@types/Category.types'

interface IntroductionProps {
  selectedCategory: string
  categoryList: CategoryListProps['categoryList']
}

const Introduction = function ({ selectedCategory, categoryList }: IntroductionProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  // 메뉴 닫기 핸들러
  const closeMenu = () => setIsMenuOpen(false)

  const data = useStaticQuery<Queries.IntroductionDataQuery>(graphql`
    query IntroductionData {
      file(name: { eq: "profile-image" }) {
        childImageSharp {
          gatsbyImageData(width: 120, height: 120)
        }
      }
    }
  `)

  const { childImageSharp } = data.file ?? {}
  const { gatsbyImageData } = childImageSharp ?? {}

  return (
    <Background>
      <Wrapper>
        <MenuButton onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <FontAwesomeIcon icon={faBars} />
        </MenuButton>
        <ContentWrapper>
          <ProfileImageWrapper image={gatsbyImageData!} alt="Profile Image" />
          <div>
            <SubTitle>안녕하세요 개발자 정진우입니다.</SubTitle>
            <Title>배운것들을 적어놓는 공간입니다.</Title>
          </div>
        </ContentWrapper>
        {/* 모바일 메뉴 오버레이 */}
        <MobileMenuOverlay isOpen={isMenuOpen} onClick={closeMenu}>
          <CategoryWrapper onClick={e => e.stopPropagation()} isOpen={isMenuOpen}>
            <CategoryList selectedCategory={selectedCategory} categoryList={categoryList} />
          </CategoryWrapper>
        </MobileMenuOverlay>
      </Wrapper>
    </Background>
  )
}

const Background = styled.div`
  width: 100%;
  background-image: linear-gradient(60deg, #29323c 0%, #485563 100%);
  color: #ffffff;
`

const Wrapper = styled.div`
  position: relative;
  width: 768px;
  height: 400px;
  margin: 0 auto;

  @media (max-width: 768px) {
    width: 100%;
    height: 300px;
    padding: 0 20px;
  }
`

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  height: 100%;
`

const MenuButton = styled.button`
  display: none;

  @media (max-width: 768px) {
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: 20px;
    right: 20px;
    width: 40px;
    height: 40px;
    border: none;
    background: transparent;
    color: white;
    font-size: 24px;
    cursor: pointer;
    z-index: 100;
  }
`

const SubTitle = styled.div`
  font-size: 20px;
  font-weight: 400;
  @media (max-width: 768px) {
    font-size: 15px;
  }
`

const Title = styled.div`
  margin-top: 5px;
  font-size: 35px;
  font-weight: 700;
  @media (max-width: 768px) {
    font-size: 25px;
  }
`

const ProfileImageWrapper = styled(GatsbyImage)`
  width: 120px;
  height: 120px;
  margin-bottom: 30px;
  border-radius: 50%;

  @media (max-width: 768px) {
    width: 80px;
    height: 80px;
  }
`

const MobileMenuOverlay = styled.div<{ isOpen: boolean }>`
  display: none;

  @media (max-width: 768px) {
    display: block;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.7);
    z-index: 90;
    opacity: ${props => (props.isOpen ? 1 : 0)};
    visibility: ${props => (props.isOpen ? 'visible' : 'hidden')};
    transition:
      opacity 0.3s ease-in-out,
      visibility 0.3s ease-in-out;
    backdrop-filter: blur(4px);
  }
`

const CategoryWrapper = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  right: 0;
  width: 80%;
  max-width: 300px;
  height: 100%;
  background-color: #29323c;
  padding: 60px 20px 20px;
  overflow-y: auto;
  box-shadow: -2px 0 8px rgba(0, 0, 0, 0.2);
  transform: translateX(${props => (props.isOpen ? '0' : '100%')});
  transition: transform 0.3s ease-in-out;

  // CategoryList 스타일 오버라이드가 필요한 경우

  & * {
    color: white;
  }
`
export default Introduction
