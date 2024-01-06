import { useCallback } from 'react'

export const useCommandAltClick = (handler: () => void) => {
  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      if ((e.metaKey || e.altKey) && e.button === 0) {
        handler()
      }
    },
    [handler],
  )

  return handleMouseDown
}
