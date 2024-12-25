import React, { useMemo } from 'react'
import { Link } from 'gatsby'
import styled from '@emotion/styled'

type CategoryNode = {
  name: string
  count: number
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

const CategoryList: React.FC<CategoryListProps> = ({ selectedCategory, categoryList }) => {
  const categoryTree = useMemo(() => {
    const tree: Record<string, CategoryNode> = {
      All: { name: 'All', count: categoryList['All'] },
    }

    Object.entries(categoryList).forEach(([path, count]) => {
      if (path === 'All') return
      console.log(path)

      const parts = path.split('/')
      const currentLevel = tree

      parts.forEach((part, index) => {
        const currentPath = parts.slice(0, index + 1).join('/')

        if (!currentLevel[currentPath]) {
          currentLevel[currentPath] = {
            name: part,
            count: 0,
          }
        }

        currentLevel[currentPath].count = count
      })
    })

    return tree
  }, [categoryList])

  const CategoryItem: React.FC<{
    path: string
    node: CategoryNode
  }> = ({ path, node }) => {
    // const hasChildren = Object.keys(node.children).length > 0
    const isSelected = selectedCategory === path

    return (
      <CategoryItemWrapper>
        <CategoryItemContent isSelected={isSelected}>
          <CategoryLink to={`/?category=${path}`}>
            {node.name}
            <CategoryCount>({node.count})</CategoryCount>
          </CategoryLink>
        </CategoryItemContent>
      </CategoryItemWrapper>
    )
  }

  return (
    <CategoryListWrapper>
      {/*<CategoryTitle>Categories</CategoryTitle>*/}
      {Object.entries(categoryTree).map(([path, node]) => (
        <CategoryItem key={path} path={path} node={node} />
      ))}
    </CategoryListWrapper>
  )
}

export default CategoryList
