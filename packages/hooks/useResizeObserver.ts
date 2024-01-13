import { useEffect, RefObject, useRef } from 'react'

export const useResizeObserver = <T extends HTMLElement | SVGSVGElement>(
  ref: RefObject<T>,
  defaultWidth: number,
  defaultHeight: number,
  callback: () => void,
) => {
  const dimensions = useRef({ width: defaultWidth, height: defaultHeight })

  useEffect(() => {
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect
      dimensions.current = { width, height }
      callback()
    })

    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [ref])

  return dimensions
}
