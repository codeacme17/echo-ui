import { forwardRef, useMemo } from 'react'
import { SwitchProps, SwitchRef } from './types'
import { SIZE } from './constants'
import { cn } from '../../../lib/utils'
import STYLES from './styles.module.css'

export const Switch = forwardRef<SwitchRef, SwitchProps>((props, ref) => {
  const { toggled = false, size = SIZE, ...restProps } = props

  const sizeClassNames = useMemo(() => {
    if (size === 'sm') return { button: 'w-12 h-6', thumb: 'w-3 h-3', label: 'text-sm' }
    if (size === 'lg') return { button: 'w-16 h-10', thumb: 'w-5 h-5', label: 'text-lg' }
    return { button: 'w-14 h-8', thumb: 'w-4 h-4' }
  }, [size])

  return (
    <label {...restProps} ref={ref} className={cn(STYLES['echo-switch'])}>
      {/* Button */}
      <span
        className={cn(
          STYLES['echo-switch-button'],
          toggled && STYLES['echo-switch-button__toggled'],
          sizeClassNames.button,
        )}
      >
        {/* Thumb */}
        <span
          className={cn(
            STYLES['echo-switch-thumb'],
            toggled && STYLES['echo-switch-thumb__toggled'],
            sizeClassNames.thumb,
          )}
        />
      </span>

      {/* Label */}
      <span className={(cn('echo-switch-label'), sizeClassNames.label)}>{restProps.children}</span>
    </label>
  )
})
