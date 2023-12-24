import { forwardRef } from 'react'
import { SpectrumProps, SpectrumRef } from './types'

export const Spectrum = forwardRef<SpectrumRef, SpectrumProps>((props, ref) => {
  const { ...restProps } = props

  return <div ref={ref}>Spectrum</div>
})
