import { PostListItemType } from '../@types/PostItem.types'
import { useEffect, useMemo, useRef, useState } from 'react'

const NUMBER_OF_ITEMS_PER_PAGE = 10

const useInfiniteScroll = function (selectedCategory: string, posts: PostListItemType[]) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [count, setCount] = useState(1)
  const observer = new IntersectionObserver((entries, observer) => {
    if (!entries[0].isIntersecting) return
    setCount(prev => prev + 1)
    observer.disconnect()
  })

  const postListByCagory = useMemo(
    () =>
      posts.filter(
        ({
          node: {
            frontmatter: { categories },
          },
        }) => (selectedCategory !== 'All' ? categories.includes(selectedCategory) : true),
      ),
    [selectedCategory],
  )

  useEffect(() => setCount(1), [selectedCategory])

  useEffect(() => {
    if (
      NUMBER_OF_ITEMS_PER_PAGE * count >= postListByCagory.length ||
      containerRef.current === null ||
      containerRef.current.children.length === 0
    ) {
      return
    }

    observer.observe(containerRef.current.children[containerRef.current.children.length - 1])
  }, [count, selectedCategory])

  return { containerRef, postList: postListByCagory.slice(0, count * NUMBER_OF_ITEMS_PER_PAGE) }
}

export default useInfiniteScroll
