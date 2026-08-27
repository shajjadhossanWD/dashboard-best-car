import { useEffect } from 'react'

export function useClickOutside(refs, handler, enabled = true) {
  useEffect(() => {
    if (!enabled) return undefined

    const list = Array.isArray(refs) ? refs : [refs]

    const isOutside = (target) =>
      list.every((ref) => !ref.current || !ref.current.contains(target))

    const onPointerDown = (event) => {
      if (isOutside(event.target)) handler(event)
    }

    const onKeyDown = (event) => {
      if (event.key === 'Escape') handler(event)
    }

    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('touchstart', onPointerDown, { passive: true })
    document.addEventListener('keydown', onKeyDown)

    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('touchstart', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [refs, handler, enabled])
}
