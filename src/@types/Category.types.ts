export type CategoryNode = {
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
