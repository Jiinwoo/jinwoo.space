import { MutableRefObject, useEffect, useMemo, useRef, useState } from 'react'

export type useInfiniteScrollType = {
  containerRef: MutableRefObject<HTMLDivElement | null>
  postList: Queries.IndexPageQuery['allMarkdownRemark']['edges']
}

const NUMBER_OF_ITEMS_PER_PAGE = 10

const useInfiniteScroll = function (
  selectedCategory: string,
  posts: Queries.IndexPageQuery['allMarkdownRemark']['edges'],
): useInfiniteScrollType {
  const containerRef: MutableRefObject<HTMLDivElement | null> = useRef<HTMLDivElement>(null)
  const observer: MutableRefObject<IntersectionObserver | null> = useRef<IntersectionObserver>(null)
  const [count, setCount] = useState<number>(1)

  const postListByCategory = useMemo(
    () =>
      posts.filter(post => {
        if (selectedCategory === 'All') return true
        return post.node.fields?.slug?.includes(
          selectedCategory
            .split('/')
            .map(segment => segment.replace(/ /g, '%20'))
            .join('/'),
        )
      }),
    [selectedCategory],
  )

  useEffect(() => {
    observer.current = new IntersectionObserver((entries, observer) => {
      if (!entries[0].isIntersecting) return

      setCount(value => value + 1)
      observer.unobserve(entries[0].target)
    })
  }, [])

  useEffect(() => setCount(1), [selectedCategory])

  useEffect(() => {
    if (
      NUMBER_OF_ITEMS_PER_PAGE * count >= postListByCategory.length ||
      containerRef.current === null ||
      containerRef.current.children.length === 0 ||
      observer.current === null
    )
      return

    observer.current.observe(containerRef.current.children[containerRef.current.children.length - 1])
  }, [count, selectedCategory])

  return {
    containerRef,
    postList: postListByCategory.slice(0, count * NUMBER_OF_ITEMS_PER_PAGE),
  }
}

export default useInfiniteScroll
