import React, { useCallback, useEffect, useRef, useState } from 'react'
import styled from '@emotion/styled'
import debounce from 'lodash/debounce'

interface TOCItem {
  id: string
  title: string
  level: number
}

interface TableOfContentsProps {
  contentSelector: string
}

const TableOfContents: React.FC<TableOfContentsProps> = ({ contentSelector }) => {
  const [headings, setHeadings] = useState<TOCItem[]>([])
  const [activeId, setActiveId] = useState<string>('')
  const [isMobile, setIsMobile] = useState(false)
  const tocRef = useRef<HTMLDivElement>(null)
  const tocListRef = useRef<HTMLUListElement>(null)

  // 모바일 체크
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // TOC 초기 위치 저장 및 스크롤 위치 조정
  useEffect(() => {
    if (isMobile || tocRef.current === null) return

    const handleScroll = debounce(() => {
      if (tocRef.current) {
        const scrollY = window.scrollY

        if (scrollY > 400) {
          tocRef.current.style.top = `${scrollY - 200}px`
        } else {
          tocRef.current.style.top = '0'
        }
      }
    }, 10)

    handleScroll()

    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [isMobile])

  // 제목 요소 추출
  useEffect(() => {
    const content = document.querySelector(contentSelector)
    if (!content) return

    const elements = content.querySelectorAll('h1, h2, h3')

    const items: TOCItem[] = Array.from(elements).map((element, index) => {
      if (!element.id) {
        element.id = `heading-${index}`
      }

      return {
        id: element.id,
        title: element.textContent || '',
        level: parseInt(element.tagName[1]),
      }
    })

    setHeadings(items)
  }, [contentSelector])

  // 활성 항목으로 스크롤
  useEffect(() => {
    if (!tocListRef.current) return

    const targetId = activeId === '' ? 'heading-0' : activeId
    const activeElement: HTMLDivElement | null = tocListRef.current.querySelector(`[data-id="${targetId}"]`)
    if (!activeElement) return

    const container = tocListRef.current
    const containerRect = container.getBoundingClientRect()
    const activeRect = activeElement.getBoundingClientRect()

    // 활성 요소가 컨테이너를 벗어났는지 확인
    if (activeRect.top < containerRect.top || activeRect.bottom > containerRect.bottom) {
      // 활성 요소가 컨테이너의 중앙에 오도록 스크롤
      const scrollTop = activeElement.offsetTop - container.offsetHeight / 2 + activeElement.offsetHeight / 2

      container.scrollTo({
        top: scrollTop,
        behavior: 'smooth',
      })
    }
  }, [activeId])

  // 스크롤 추적
  useEffect(() => {
    const callback = debounce(() => {
      const headingElements = headings
        .map(({ id }) => document.getElementById(id))
        .filter((element): element is HTMLElement => element !== null)

      const visibleHeadings: { element: HTMLElement; top: number }[] = []

      headingElements.forEach(element => {
        const rect = element.getBoundingClientRect()
        if (rect.top <= 100) {
          visibleHeadings.push({ element, top: Math.abs(rect.top - 100) })
        }
      })

      if (visibleHeadings.length > 0) {
        const closest = visibleHeadings.reduce((prev, curr) => (prev.top < curr.top ? prev : curr))
        setActiveId(closest.element.id)
      } else {
        // 스크롤이 맨 위에 있을 때
        setActiveId('')
      }
    }, 100)
    // callback()

    window.addEventListener('scroll', callback)
    return () => window.removeEventListener('scroll', callback)
  }, [headings])

  const handleClick = useCallback(
    (id: string) => {
      document.getElementById(id)?.scrollIntoView({
        behavior: 'smooth',
      })
    },
    [isMobile],
  )

  return (
    <>
      <TOCContainer ref={tocRef} isMobile={isMobile} onClick={e => e.stopPropagation()}>
        <TOCTitle>목차</TOCTitle>
        <TOCList ref={tocListRef}>
          {headings.map((heading, i) => (
            <TOCItem
              key={heading.id}
              level={heading.level}
              isActive={activeId === '' ? i === 0 : activeId === heading.id}
              data-id={heading.id}
            >
              <TOCLink onClick={() => handleClick(heading.id)} isActive={activeId === heading.id}>
                {heading.title}
              </TOCLink>
            </TOCItem>
          ))}
        </TOCList>
      </TOCContainer>
    </>
  )
}

const TOCContainer = styled.nav<{ isMobile: boolean }>`
  ${({ isMobile }) =>
    isMobile
      ? `
        opacity: 0;
        visibility: hidden; 
      `
      : `
        position: absolute;
        left: 100%;
        margin-top: 2.5rem;
        margin-left: 2rem;
        width: 250px;
        background: white;
        border-radius: 8px;
        border: 1px solid #e2e8f0;
        max-height: calc(100vh - 100px);
        transition: top 0.3s ease;
      `}
`

const TOCTitle = styled.h2`
  font-size: 1.2em;
  margin-bottom: 1rem;
  color: #2d3748;
  font-weight: 600;
  padding: 0.5rem 1rem;
`

const TOCList = styled.ul`
  list-style: none;
  margin: 0;
  overflow-y: auto;
  max-height: calc(400px - 4rem);
  border-top: 1px solid #e2e8f0;
  padding-left: 1rem;
  padding-right: 1rem;
`

const TOCItem = styled.li<{ level: number; isActive: boolean }>`
  margin: 0.5rem 0;
  padding-left: ${props => (props.level - 1) * 1}rem;
  border-left: 2px solid ${props => (props.isActive ? '#4a9eff' : 'transparent')};
`

const TOCLink = styled.button<{ isActive: boolean }>`
  background: none;
  border: none;
  padding: 4px 8px;
  color: ${props => (props.isActive ? '#4a9eff' : '#4a5568')};
  text-decoration: none;
  font-size: 0.95em;
  cursor: pointer;
  width: 100%;
  text-align: left;

  &:hover {
    color: #4a9eff;
  }
`

export default TableOfContents
