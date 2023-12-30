import { forwardRef, useEffect, useMemo, useState } from 'react'
import { cn, convertColorToRGBA } from '../../../lib/utils'
import { LightProps, LightRef } from './types'
import { useStyle } from './styles'
import { SIZE, COLOR } from './constants'

export const Light = forwardRef<LightRef, LightProps>((props, ref) => {
  const { on = false, size = SIZE, color = COLOR, className, style, ...restProps } = props

  const [onState, setOnState] = useState(on)

  useEffect(() => {
    setOnState(on)
  }, [on])

  const glassColor = useMemo(() => convertColorToRGBA(color, 0.2), [color])

  const { base, glass } = useStyle()

  return (
    <div
      {...restProps}
      ref={ref}
      className={cn(base(), className)}
      style={{
        ...style,
        backdropFilter: `blur(2px)`,
        zIndex: 2,
        width: size,
        height: size,
        borderRadius: '100%',
        border: '2px solid var(--echo-border)',
        backgroundColor: onState ? color : '',
        boxShadow: onState
          ? `0 0 2px 2px ${color},
             0 0 5px 2px ${color}`
          : '',
      }}
    >
      <div
        className={cn(glass())}
        style={{
          backgroundImage: `
            radial-gradient(circle, ${glassColor} 10%, transparent 1%),
            radial-gradient(circle, transparent 10%, ${glassColor} 1%)`,
        }}
      />
    </div>
  )
})
