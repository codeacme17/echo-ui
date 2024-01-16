import { forwardRef } from 'react'
import { cn } from '../../../lib/utils'
import { useStyle } from './styles'
import { WaveformProps, WaveformRef } from './types'

export const Waveform = forwardRef<WaveformRef, WaveformProps>((props, ref) => {
  const { ...restProps } = props

  const { base, canvas } = useStyle()

  return (
    <div
      ref={ref}
      {...restProps}
      className={cn(base(), restProps.className)}
      style={{ ...restProps.style }}
    >
      <canvas className={cn(canvas())} />
    </div>
  )
})
