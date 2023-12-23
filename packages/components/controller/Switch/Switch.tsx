import { forwardRef } from 'react'
import { SwitchProps, SwitchRef } from './types'
import { cn } from '../../../lib/utils'
import STYLES from './styles.module.css'

export const Switch = forwardRef<SwitchRef, SwitchProps>((props, ref) => {
  const { toggled = true, ...restProps } = props

  return (
    <label {...restProps} ref={ref} className={cn(STYLES['echo-switch'])}>
      <span
        className={cn(
          STYLES['echo-switch-button'],
          toggled && STYLES['echo-switch-button__toggled'],
        )}
      >
        <span
          className={cn(
            STYLES['echo-switch-thumb'],
            toggled && STYLES['echo-switch-thumb__toggled'],
          )}
        />
      </span>

      <span className={cn('echo-switch-label')}>{restProps.children}</span>
    </label>
  )
})
