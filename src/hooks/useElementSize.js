import { useCallback, useLayoutEffect, useRef, useState } from 'react'

export function useElementSize() {
  const ref = useRef(null)
  const [size, setSize] = useState({ width: 0, height: 0 })

  const measure = useCallback((node) => {
    if (!node) return
    const { width, height } = node.getBoundingClientRect()
    setSize((prev) => (prev.width === width && prev.height === height ? prev : { width, height }))
  }, [])

  useLayoutEffect(() => {
    const node = ref.current
    if (!node) return undefined

    measure(node)
    const observer = new ResizeObserver(() => measure(node))
    observer.observe(node)
    return () => observer.disconnect()
  }, [measure])

  return [ref, size]
}
