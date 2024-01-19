import { useEffect, RefObject, useRef } from 'react'

/**
 * Hook that returns the dimensions of the element that is passed as a ref.
 *
 * @param {RefObject<T>} ref - The ref of the element to observe.
 * @param {number} defaultWidth - The default width to return if the ref is not yet defined.
 * @param {number} defaultHeight - The default height to return if the ref is not yet defined.
 * @param {() => void} callback - The callback function to run when the dimensions change.
 * @returns {{ width: number, height: number }} - The dimensions of the element.
 *
 * @example
 * const ref = useRef<HTMLDivElement>(null)
 * const { width, height } = useResizeObserver(ref, 0, 0, () => console.log('Dimensions changed!'))
 */
export const useResizeObserver = <T extends HTMLElement | SVGSVGElement>(
  ref: RefObject<T>,
  defaultWidth: number,
  defaultHeight: number,
  callback: () => void,
) => {
  const dimensions = useRef({ width: defaultWidth, height: defaultHeight })

  useEffect(() => {
    const throttledCallback = throttle(callback, 100)

    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect
      dimensions.current = { width, height }
      throttledCallback()
    })

    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [ref])

  return dimensions
}

const throttle = (func: () => void, limit: number) => {
  let inThrottle: boolean
  return function () {
    if (!inThrottle) {
      func()
      inThrottle = true
      setTimeout(() => {
        inThrottle = false
        func()
      }, limit)
    }
  }
}
