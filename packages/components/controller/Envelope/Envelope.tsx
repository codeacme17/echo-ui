import * as d3 from 'd3'
import { forwardRef, useEffect, useRef } from 'react'
import { cn } from '../../../lib/utils'
import { EnvelopeProps, EnvelopeRef } from './types'
import { useStyle } from './styles'

export const Envelope = forwardRef<EnvelopeRef, EnvelopeProps>((props, ref) => {
  const { ...restProps } = props

  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    initCurve()
  }, [])

  const initCurve = () => {
    const svg = d3.select(svgRef.current)
    console.log(svg)
  }

  const { base, svg: _svg } = useStyle()

  return (
    <div ref={ref} {...restProps} className={cn(base())}>
      <svg ref={svgRef} className={cn(_svg())} />
    </div>
  )
})
