import { forwardRef, useCallback, useContext } from 'react'
import { CheckboxProps, CheckboxChangeEvent, CheckboxRef } from './types'
import { CheckboxGroupContext } from './context'
import { cn } from '../../../lib/utils'
import styles from './styles.module.css'

export const Checkbox = forwardRef<CheckboxRef, CheckboxProps>((props, ref) => {
  const {
    value,
    children,
    checked: _checked,
    disabled: _disabled = false,
    onChange,
    ...restProps
  } = props

  const groupContext = useContext(CheckboxGroupContext)
  const isInGroup = groupContext !== null

  let disabled = _disabled
  if (isInGroup) {
    disabled = groupContext!.disabled || disabled
  }

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (disabled) return

      const opt: CheckboxChangeEvent = {
        value: value,
        nativeEvent: e,
      }

      if (isInGroup) groupContext.onChange?.(opt)
      else onChange?.(opt)
    },
    [onChange, disabled, groupContext, value, isInGroup],
  )

  const checked = isInGroup ? groupContext.value!.includes(value) : _checked

  return (
    <label
      ref={ref}
      className={cn(styles['echo-checkbox'], disabled && styles['echo-checkbox__disabled'])}
      onMouseDown={restProps.onMouseDown}
    >
      <input
        {...restProps}
        type="checkbox"
        className={cn(styles['echo-checkbox-input'])}
        disabled={disabled}
        checked={checked}
        onChange={handleChange}
      />

      <div className={cn(styles['echo-checkbox-label'])}>{children}</div>
    </label>
  )
})
