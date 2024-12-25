import React from 'react'
import styled from '@emotion/styled'
import { graphql, Link, useStaticQuery } from 'gatsby'

interface CategoryProps {
  selectedCategory: string
  variant?: 'sidebar' | 'mobile'
  onItemClick?: () => void
}

// GraphQL 쿼리를 컴포넌트 외부로 분리
const CATEGORY_QUERY = graphql`
  query Category {
    allMarkdownRemark {
      group(field: { fields: { category: SELECT } }) {
        fieldValue
        totalCount
      }
    }
  }
`

// 카테고리 데이터 처리 로직을 분리
const useCategoryData = () => {
  const { allMarkdownRemark } = useStaticQuery<Queries.CategoryQuery>(CATEGORY_QUERY)

  const categoryList = (allMarkdownRemark.group ?? []).reduce(
    (acc, { fieldValue, totalCount }) => {
      if (fieldValue) {
        acc[fieldValue] = totalCount
        acc['All'] = (acc['All'] ?? 0) + totalCount
      }
      return acc
    },
    {} as Record<string, number>,
  )

  // All 카테고리를 맨 위로 정렬하기 위한 정렬 로직
  return Object.entries(categoryList).sort(([a], [b]) => {
    if (a === 'All') return -1
    if (b === 'All') return 1
    return a.localeCompare(b)
  })
}

const CategoryList: React.FC<CategoryProps> = ({ selectedCategory, variant = 'sidebar', onItemClick }) => {
  const sortedCategories = useCategoryData()

  return (
    <CategoryListWrapper variant={variant}>
      {sortedCategories.map(([path, count]) => (
        <CategoryItem key={path} isSelected={selectedCategory === path} onClick={onItemClick}>
          <CategoryLink to={`/?category=${path}`}>
            {path}
            <CategoryCount isSelected={selectedCategory === path}>({count})</CategoryCount>
          </CategoryLink>
        </CategoryItem>
      ))}
    </CategoryListWrapper>
  )
}

const CategoryListWrapper = styled.nav<{ variant: CategoryProps['variant'] }>`
  width: 100%;
  padding: ${({ variant }) => (variant === 'mobile' ? '0.5rem' : '1rem')};
`

const CategoryItem = styled.div<{ isSelected: boolean }>`
  margin: 0.5rem 0;
  padding: 0.5rem;
  border-radius: 4px;
  color: ${({ isSelected, theme }) => (isSelected ? theme.colors.text.inverse : theme.colors.text.primary)};
  background-color: ${({ theme, isSelected }) => (isSelected ? theme.colors.primary.hover.light : 'transparent')};
  transition:
    background-color 0.2s ease-in-out,
    color 0.2s ease-in-out;

  &:hover {
    background-color: ${({ theme }) => theme.colors.background.hover.secondary};
    color: ${({ theme, isSelected }) =>
      isSelected ? theme.colors.primary.hover.main : theme.colors.text.hover.primary};
  }
`

const CategoryLink = styled(Link)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  color: inherit;
  text-decoration: none;
`

const CategoryCount = styled.span<{ isSelected: boolean }>`
  font-size: 0.875rem;
  color: ${({ theme, isSelected }) => (isSelected ? theme.colors.text.inverse : theme.colors.text.secondary)};
`

export default CategoryList
