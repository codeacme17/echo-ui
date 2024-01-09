import { forwardRef } from 'react'
import { cn } from '../../../lib/utils'
import { OscilloscopeProps, OscilloscopeRef } from './types'
import { useStyle } from './styles'

export const Oscilloscope = forwardRef<OscilloscopeRef, OscilloscopeProps>((props, ref) => {
  const { ...restProps } = props

  const { base, chart } = useStyle()

  return (
    <div
      {...restProps}
      ref={ref}
      className={cn(base(), restProps.className)}
      style={restProps.style}
    >
      <svg className={cn(chart())} />
    </div>
  )
})
