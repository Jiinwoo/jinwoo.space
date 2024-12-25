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

const MOBILE_BREAKPOINT = 768
const MIN_SIDEBAR_WIDTH = 216
const SCROLL_THRESHOLD = 400
const SCROLL_OFFSET = 200
const HEADING_OFFSET = 100
const DEBOUNCE_DELAY = 100

const TableOfContents: React.FC<TableOfContentsProps> = ({ contentSelector }) => {
  const [headings, setHeadings] = useState<TOCItem[]>([])
  const [activeId, setActiveId] = useState<string>('')
  const [isNotVisible, setIsNotVisible] = useState(true)
  const tocRef = useRef<HTMLDivElement>(null)
  const tocListRef = useRef<HTMLUListElement>(null)

  const checkMobile = useCallback(() => {
    setIsNotVisible(
      window.innerWidth < MOBILE_BREAKPOINT || (window.innerWidth - MOBILE_BREAKPOINT) / 2 < MIN_SIDEBAR_WIDTH,
    )
  }, [])

  const handleTOCScroll = useCallback(
    debounce(() => {
      if (!tocRef.current) return
      const scrollY = window.scrollY
      tocRef.current.style.top = scrollY > SCROLL_THRESHOLD ? `${scrollY - SCROLL_OFFSET}px` : `${scrollY / 2}px`
    }, DEBOUNCE_DELAY),
    [],
  )

  const handleHeadingScroll = useCallback(
    debounce(() => {
      const headingElements = headings
        .map(({ id }) => document.getElementById(id))
        .filter((element): element is HTMLElement => element !== null)

      const visibleHeadings = headingElements
        .filter(element => element.getBoundingClientRect().top <= HEADING_OFFSET)
        .map(element => ({
          element,
          top: Math.abs(element.getBoundingClientRect().top - HEADING_OFFSET),
        }))

      setActiveId(
        visibleHeadings.length > 0
          ? visibleHeadings.reduce((prev, curr) => (prev.top < curr.top ? prev : curr)).element.id
          : '',
      )
    }, DEBOUNCE_DELAY),
    [headings],
  )

  const scrollToHeading = useCallback((id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => {
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [checkMobile])

  useEffect(() => {
    if (isNotVisible) return
    handleTOCScroll()
    window.addEventListener('scroll', handleTOCScroll)
    return () => window.removeEventListener('scroll', handleTOCScroll)
  }, [isNotVisible, handleTOCScroll])

  useEffect(() => {
    const content = document.querySelector(contentSelector)
    if (!content) return

    const elements = content.querySelectorAll('h1, h2, h3')
    const items: TOCItem[] = Array.from(elements).map((element, index) => ({
      id: element.id || `heading-${index}`,
      title: element.textContent || '',
      level: parseInt(element.tagName[1]),
    }))

    setHeadings(items)
  }, [contentSelector])

  useEffect(() => {
    const container = tocListRef.current
    const activeElement = container?.querySelector(`[data-id="${activeId || 'heading-0'}"]`) as HTMLDivElement
    if (!container || !activeElement) return

    const containerRect = container.getBoundingClientRect()
    const activeRect = activeElement.getBoundingClientRect()

    if (activeRect.top < containerRect.top || activeRect.bottom > containerRect.bottom) {
      const scrollTop = activeElement.offsetTop - container.offsetHeight / 2 + activeElement.offsetHeight / 2
      container.scrollTo({ top: scrollTop, behavior: 'smooth' })
    }
  }, [activeId])

  useEffect(() => {
    window.addEventListener('scroll', handleHeadingScroll)
    return () => window.removeEventListener('scroll', handleHeadingScroll)
  }, [handleHeadingScroll])

  return (
    <TOCContainer ref={tocRef} $isNotVisible={isNotVisible} onClick={e => e.stopPropagation()}>
      <TOCTitle>목차</TOCTitle>
      <TOCList ref={tocListRef}>
        {headings.map((heading, i) => (
          <TOCItem
            key={heading.id}
            $level={heading.level}
            $isActive={activeId === '' ? i === 0 : activeId === heading.id}
            data-id={heading.id}
          >
            <TOCLink
              onClick={() => scrollToHeading(heading.id)}
              $isActive={activeId === '' ? i === 0 : activeId === heading.id}
            >
              {heading.title}
            </TOCLink>
          </TOCItem>
        ))}
      </TOCList>
    </TOCContainer>
  )
}

const TOCContainer = styled.nav<{ $isNotVisible: boolean }>`
  ${({ $isNotVisible }) =>
    $isNotVisible
      ? `
        opacity: 0;
        visibility: hidden; 
        display:none;
      `
      : `
        position: absolute;
        right: 0px;
        margin-top: 16px;
        width: 200px;
        background: white;
        border-radius: 8px;
        border: 1px solid #e2e8f0;
        max-height: calc(100vh - 100px);
        transition: top 0.3s ease;
      `}
`

const TOCTitle = styled.h2`
  font-size: 1rem;
  margin-bottom: 0.75rem;
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

const TOCItem = styled.li<{ $level: number; $isActive: boolean }>`
  margin: 0.5rem 0;
  padding-left: ${props => (props.$level - 1) * 0.75}rem;
  border-left: 2px solid ${props => (props.$isActive ? '#4a9eff' : 'transparent')};
`

const TOCLink = styled.button<{ $isActive: boolean }>`
  background: none;
  border: none;
  padding: 4px 8px;
  color: ${props => (props.$isActive ? '#4a9eff' : '#4a5568')};
  text-decoration: none;
  font-size: 0.875rem;
  cursor: pointer;
  width: 100%;
  text-align: left;

  &:hover {
    color: #4a9eff;
  }
`

export default TableOfContents
