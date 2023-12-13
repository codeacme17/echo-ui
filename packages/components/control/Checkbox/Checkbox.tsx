import { forwardRef, useContext } from 'react'
import { cn } from '../../../lib/utils'
import { CheckboxProps, CheckboxChangeEvent, CheckboxRef } from './types'
import { CheckboxGroupContext } from './context'
import styles from './styles.module.css'

/**
 * TODO
 * - Fix issue which click and change occure twice
 */

export const Checkbox = forwardRef<CheckboxRef, CheckboxProps>((props, ref) => {
  const {
    value,
    checked: _checked,
    disabled: _disabled,
    inputClassName: _inputClassName,
    inputStyle,
    labelClassName,
    labelStyle,
    onChange,
    ...restProps
  } = props

  const groupContext = useContext(CheckboxGroupContext)
  const isInGroup = groupContext !== null

  let inputClassName = _inputClassName
  let disabled = _disabled
  if (isInGroup) {
    // If the user has specified a className for the checkbox input,
    // it will override the one which is specified in the group context
    inputClassName = inputClassName || groupContext!.inputClassName
    disabled = groupContext!.disabled || disabled
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return

    const opt: CheckboxChangeEvent = {
      value: value,
      nativeEvent: e,
    }

    if (isInGroup) groupContext.onChange?.(opt)
    else onChange?.(opt)
  }

  const checked = isInGroup ? groupContext.value!.includes(value) : _checked

  return (
    <label
      ref={ref}
      className={cn(
        styles['echo-checkbox'],
        disabled && styles['echo-checkbox__disabled'],
        restProps.className,
      )}
      style={{ ...restProps.style }}
    >
      <input
        type="checkbox"
        className={cn(styles['echo-checkbox-input'], inputClassName)}
        style={{ ...inputStyle }}
        disabled={disabled}
        checked={checked}
        onChange={handleChange}
      />

      <div className={cn(styles['echo-checkbox-label'], labelClassName)} style={{ ...labelStyle }}>
        {restProps.children}
      </div>
    </label>
  )
})
