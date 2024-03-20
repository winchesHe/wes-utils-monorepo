import { getDocumentElement } from './dom'

export function observeMove(element: Element, onMove: () => void) {
  if (!element)
    return () => undefined

  let io: IntersectionObserver | null = null
  let timeoutId: NodeJS.Timeout

  const root = getDocumentElement(element)

  function cleanup() {
    clearTimeout(timeoutId)
    io?.disconnect()
    io = null
  }

  function refresh(move = false, threshold = 1) {
    cleanup()

    const { left, top, width, height } = element.getBoundingClientRect()

    if (move)
      onMove()

    if (!width || !height)
      return

    const insetTop = Math.floor(top)
    const insetRight = Math.floor(root.clientWidth - (left + width))
    const insetBottom = Math.floor(root.clientHeight - (top + height))
    const insetLeft = Math.floor(left)
    const rootMargin = `${-insetTop}px ${-insetRight}px ${-insetBottom}px ${-insetLeft}px`

    const options = {
      rootMargin,
      threshold: Math.max(0, Math.min(1, threshold)) || 1,
    }

    let isFirstUpdate = true

    function handleObserve(entries: IntersectionObserverEntry[]) {
      const ratio = entries[0].intersectionRatio

      if (ratio !== threshold) {
        if (!isFirstUpdate)
          return refresh(true)

        if (!ratio) {
          timeoutId = setTimeout(() => {
            refresh(true, 1e-7)
          }, 100)
        }
        else {
          refresh(true, ratio)
        }
      }

      isFirstUpdate = false
    }

    // Older browsers don't support a `document` as the root and will throw an error
    try {
      io = new IntersectionObserver(handleObserve, {
        ...options,
        // Handle <iframe>s
        root: root.ownerDocument,
      })
    }
    catch (e) {
      io = new IntersectionObserver(handleObserve, options)
    }

    io.observe(element)
  }

  refresh()

  return cleanup
}
