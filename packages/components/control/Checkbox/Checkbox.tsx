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
    className: _className,
    style: _style,
    onChange,
    onMouseEnter,
    onMouseLeave,
    ...restProps
  } = props

  const groupContext = useContext(CheckboxGroupContext)
  const isInGroup = groupContext !== null
  const checked = isInGroup ? groupContext.value!.includes(value) : _checked

  let disabled = _disabled
  let className = _className
  let style = _style
  if (isInGroup) {
    disabled = groupContext!.disabled || disabled
    className = className || groupContext!.checkboxClassName
    style = style || groupContext!.checkboxStyle
  }

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (disabled) return
      const opt: CheckboxChangeEvent = { value, nativeEvent: e }
      if (isInGroup) groupContext.onChange?.(opt)
      else onChange?.(opt)
    },
    [onChange, disabled, groupContext, value, isInGroup],
  )

  return (
    <label
      ref={ref}
      className={cn(
        styles['echo-checkbox'],
        disabled && styles['echo-checkbox__disabled'],
        className,
      )}
      style={style}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <input
        {...restProps}
        type="checkbox"
        className={cn(styles['echo-checkbox-button'])}
        disabled={disabled}
        checked={checked}
        onChange={handleChange}
      />

      <span className={cn(styles['echo-checkbox-label'])}>{children}</span>
    </label>
  )
})
