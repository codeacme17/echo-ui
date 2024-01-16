import { useCallback } from 'react'

/**
 * Hook that returns a handler that runs the passed function when the user alt-clicks.
 *
 * @param {() => void} handler - The function to run when the user alt-clicks.
 * @returns {(e: React.MouseEvent<HTMLDivElement, MouseEvent> | MouseEvent) => void} - The handler function.
 *
 * @example
 * const handleMouseDown = useCommandAltClick(() => console.log('Alt-clicked!'))
 * <div onMouseDown={handleMouseDown} />
 */

export const useCommandAltClick = (handler: () => void) => {
  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent> | MouseEvent) => {
      if ((e.metaKey || e.altKey) && e.button === 0) {
        handler()
      }
    },
    [handler],
  )

  return handleMouseDown
}
