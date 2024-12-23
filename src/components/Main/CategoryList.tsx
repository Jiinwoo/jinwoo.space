import React, { useMemo } from 'react'
import { Link } from 'gatsby'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown, faChevronRight } from '@fortawesome/free-solid-svg-icons'
import styled from '@emotion/styled'

type CategoryNode = {
  name: string
  count: number

  children: Record<string, CategoryNode>
}

export type CategoryListProps = {
  selectedCategory: string
  categoryList: {
    [key: string]: number
  }
}

const CategoryListWrapper = styled.nav`
  margin: 32px 0;
`

const CategoryTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: bold;
  margin-bottom: 16px;
`

const CategoryItemWrapper = styled.div`
  margin-left: 16px;
`

const CategoryItemContent = styled.div<{ isSelected: boolean }>`
  display: flex;
  align-items: center;
  padding: 8px 0;
  cursor: pointer;
  color: ${props => (props.isSelected ? '#3182ce' : '#4a5568')};
  font-weight: ${props => (props.isSelected ? 'bold' : 'normal')};

  &:hover {
    color: ${props => (props.isSelected ? '#3182ce' : '#1a202c')};
  }
`

const IconWrapper = styled.div`
  width: 24px;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 16px;
    height: 16px;
  }
`

const CategoryLink = styled(Link)`
  flex: 1;
  text-decoration: none;
  color: inherit;
  transition: color 0.2s ease-in-out;

  &:hover {
    color: #3182ce;
  }
`

const CategoryCount = styled.span`
  margin-left: 8px;
  font-size: 0.875rem;
  color: #718096;
`

const ChildrenWrapper = styled.div`
  margin-left: 16px;
`

const CategoryList: React.FC<CategoryListProps> = ({ selectedCategory, categoryList }) => {
  const categoryTree = useMemo(() => {
    const tree: Record<string, CategoryNode> = {
      All: { name: 'All', count: categoryList['All'], children: {} },
    }

    Object.entries(categoryList).forEach(([path, count]) => {
      if (path === 'All') return

      const parts = path.split('/')
      let currentLevel = tree

      parts.forEach((part, index) => {
        const currentPath = parts.slice(0, index + 1).join('/')

        if (!currentLevel[currentPath]) {
          currentLevel[currentPath] = {
            name: part,
            count: 0,
            children: {},
          }
        }

        currentLevel[currentPath].count = count
        currentLevel = currentLevel[currentPath].children
      })
    })

    return tree
  }, [categoryList])

  const CategoryItem: React.FC<{
    path: string
    node: CategoryNode
    depth?: number
  }> = ({ path, node, depth = 0 }) => {
    const [isOpen, setIsOpen] = React.useState(true)
    const hasChildren = Object.keys(node.children).length > 0
    const isSelected = selectedCategory === path

    return (
      <CategoryItemWrapper>
        <CategoryItemContent isSelected={isSelected}>
          <IconWrapper onClick={() => hasChildren && setIsOpen(!isOpen)}>
            {hasChildren && <FontAwesomeIcon icon={isOpen ? faChevronDown : faChevronRight} />}
          </IconWrapper>

          <CategoryLink to={`/?category=${path}`}>
            {node.name}
            <CategoryCount>({node.count})</CategoryCount>
          </CategoryLink>
        </CategoryItemContent>

        {isOpen && hasChildren && (
          <ChildrenWrapper>
            {Object.entries(node.children).map(([childPath, childNode]) => (
              <CategoryItem key={childPath} path={childPath} node={childNode} depth={depth + 1} />
            ))}
          </ChildrenWrapper>
        )}
      </CategoryItemWrapper>
    )
  }

  return (
    <CategoryListWrapper>
      <CategoryTitle>Categories</CategoryTitle>
      {Object.entries(categoryTree).map(([path, node]) => (
        <CategoryItem key={path} path={path} node={node} />
      ))}
    </CategoryListWrapper>
  )
}

export default CategoryList
