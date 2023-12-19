import { forwardRef, useEffect, useMemo, useState } from 'react'
import { IndicatorLightProps, IndicatorLightRef } from './types'
import { SIZE, COLOR } from './constants'
import { cn, convertColorToRGBA } from '../../../lib/utils'
import styles from './styles.module.css'

export const IndicatorLight = forwardRef<IndicatorLightRef, IndicatorLightProps>((props, ref) => {
  const { on = false, size = SIZE, color = COLOR, className, style, ...restProps } = props

  const [onState, setOnState] = useState(on)

  useEffect(() => {
    setOnState(on)
  }, [on])

  const glassColor = useMemo(() => convertColorToRGBA(color, 0.2), [color])

  return (
    <div
      {...restProps}
      ref={ref}
      className={cn(
        styles['echo-indicator-light'],
        onState && styles['indicator-light__on'],
        className,
      )}
      style={{
        ...style,
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
        className={cn(styles['echo-indicator-light-glass'])}
        style={{
          backgroundImage: `
            radial-gradient(circle, ${glassColor} 10%, transparent 1%),
            radial-gradient(circle, transparent 10%, ${glassColor} 1%)`,
        }}
      />
    </div>
  )
})
