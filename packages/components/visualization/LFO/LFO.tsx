import { forwardRef, useImperativeHandle, useRef } from 'react'
import { useResizeObserver } from '../../../lib/hooks/useResizeObserver'
import { cn } from '../../../lib/utils'
import { LFOProps, LFORef } from './types'
import { useStyle } from './styles'
import { WIDTH, HEIGHT, LINE_WIDTH, LINE_COLOR } from './constants'

export const LFO = forwardRef<LFORef, LFOProps>((props, ref) => {
  const { lineWidth = LINE_WIDTH, lineColor = LINE_COLOR, ...restProps } = props

  const LFORef = useRef<LFORef | null>(null)

  useImperativeHandle(ref, () => LFORef.current as LFORef)

  const dementions = useResizeObserver(LFORef, WIDTH, HEIGHT, () => {})

  console.log(dementions)

  const { base, svg } = useStyle()

  return (
    <div
      ref={LFORef}
      className={cn(base(), restProps.className)}
      style={{
        ...restProps.style,
        padding: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        userSelect: 'none',
      }}
    >
      <svg className={cn(svg())} />
    </div>
  )
})
