import { useEffect, RefObject, useRef } from 'react'

/**
 * Hook that returns the dimensions of the element that is passed as a ref.
 *
 * @param {RefObject<T>} ref - The ref of the element to observe.
 * @param {number} defaultWidth - The default width to return if the ref is not yet defined.
 * @param {number} defaultHeight - The default height to return if the ref is not yet defined.
 * @param {() => void} callback - The callback function to run when the dimensions change.
 * @param {boolean} toggleThrottle - Whether to throttle the callback function.
 * @param {unknown} data - The data to watch for changes.
 * @returns {{ width: number, height: number }} - The dimensions of the element.
 *
 * @example
 * const ref = useRef<HTMLDivElement>(null)
 * const { width, height } = useResizeObserver(ref, 0, 0, () => console.log('Dimensions changed!'))
 */
export const useResizeObserver = <T extends HTMLElement | SVGSVGElement>(
  ref: RefObject<T | null>,
  defaultWidth: number,
  defaultHeight: number,
  callback: () => void,
  toggleThrottle: boolean = true,
  data: unknown = null,
) => {
  const dimensions = useRef({ width: defaultWidth, height: defaultHeight })

  useEffect(() => {
    const throttledCallback = throttle(callback, 100)

    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect
      if (width !== dimensions.current.width || height !== dimensions.current.height) {
        dimensions.current = { width, height }
        if (toggleThrottle) throttledCallback()
        else callback()
      }
    })
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [ref, toggleThrottle, defaultWidth, defaultHeight, data])

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
