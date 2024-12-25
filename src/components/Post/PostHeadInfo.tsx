import React, { FunctionComponent, useState } from 'react'
import styled from '@emotion/styled'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faBars } from '@fortawesome/free-solid-svg-icons'
import CategoryList from '@/components/common/CategoryList'

export type PostHeadInfoProps = {
  title: string
  date: string
  tags: string[]
  selectedCategory: string
}

const PostHeadInfo: FunctionComponent<PostHeadInfoProps> = function ({ title, date, tags, selectedCategory }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  // 메뉴 닫기 핸들러
  const closeMenu = () => setIsMenuOpen(false)

  const goBackPage = () => window.history.back()

  return (
    <PostHeadInfoWrapper>
      <NavWrapper>
        <PrevPageIcon onClick={goBackPage}>
          <FontAwesomeIcon icon={faArrowLeft} />
        </PrevPageIcon>
        <MenuButton onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <FontAwesomeIcon icon={faBars} />
        </MenuButton>
      </NavWrapper>

      <Title>{title}</Title>
      <PostData>
        <div>{tags.join(', ')}</div>
        <div>{date}</div>
      </PostData>
      {/* 모바일 메뉴 오버레이 */}
      <MobileMenuOverlay isOpen={isMenuOpen} onClick={closeMenu}>
        <CategoryWrapper onClick={e => e.stopPropagation()} isOpen={isMenuOpen}>
          <CategoryList selectedCategory={selectedCategory} variant={'mobile'} />
        </CategoryWrapper>
      </MobileMenuOverlay>
    </PostHeadInfoWrapper>
  )
}

const PostHeadInfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 768px;
  height: 100%;
  margin: 0 auto;
  padding: 60px 0;
  color: #ffffff;

  @media (max-width: 768px) {
    width: 100%;
    padding: 20px;
  }
`

const PrevPageIcon = styled.div`
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #ffffff;
  color: #000000;
  font-size: 22px;
  cursor: pointer;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);

  @media (max-width: 768px) {
    width: 30px;
    height: 30px;
    font-size: 18px;
  }
`

const Title = styled.div`
  display: -webkit-box;
  overflow: hidden;
  overflow-wrap: break-word;
  margin-top: auto;
  text-overflow: ellipsis;
  white-space: normal;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  font-size: 45px;
  font-weight: 800;

  @media (max-width: 768px) {
    font-size: 30px;
  }
`

const PostData = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
  font-size: 18px;
  font-weight: 700;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    font-size: 15px;
    font-weight: 400;
  }
`

const NavWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  //margin-top: 20px;
  height: 40px;
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

export default PostHeadInfo
