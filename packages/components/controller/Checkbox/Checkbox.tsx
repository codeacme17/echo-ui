import { forwardRef, useCallback, useContext } from 'react'
import { cn } from '../../../lib/utils'
import { CheckboxProps, CheckboxChangeEvent, CheckboxRef } from './types'
import { CheckboxGroupContext } from './context'
import { useStyle } from './styles'

export const Checkbox = forwardRef<CheckboxRef, CheckboxProps>((props, ref) => {
  const {
    value,
    children,
    checked: _checked,
    disabled: _disabled,
    size: _size,
    classNames,
    styles,
    onChange,
    onMouseEnter,
    onMouseLeave,
    onClick,
    ...restProps
  } = props

  const groupContext = useContext(CheckboxGroupContext)
  const isInGroup = groupContext !== null
  const checked = isInGroup ? groupContext.value!.includes(value) : _checked
  const disabled = _disabled === undefined ? groupContext?.disabled : _disabled
  const size = _size ? _size : groupContext?.size

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (disabled) return

      const opt: CheckboxChangeEvent = {
        value: isInGroup ? value : e.target.checked,
        nativeEvent: e,
      }

      if (isInGroup) groupContext.onChange?.(opt)
      else onChange?.(opt)
    },
    [disabled, value, isInGroup, onChange, groupContext?.onChange],
  )

  const { base, button, label } = useStyle({ size, disabled })

  return (
    <label
      ref={ref}
      data-checked={checked}
      data-disabled={disabled}
      className={cn(base(), isInGroup && groupContext.classNames?.checkbox, restProps.className)}
      style={{
        ...(isInGroup && groupContext.styles?.checkbox),
        ...restProps.style,
      }}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* I called it button although its a input element */}
      <input
        {...restProps}
        type="checkbox"
        disabled={disabled}
        checked={checked}
        onChange={handleChange}
        className={cn(button(), isInGroup && groupContext.classNames?.button, classNames?.button)}
        style={{
          ...(isInGroup && groupContext.styles?.button),
          ...styles?.button,
        }}
      />

      <span
        className={cn(label(), isInGroup && groupContext.classNames?.label, classNames?.label)}
        style={{
          ...(isInGroup && groupContext.styles?.label),
          ...styles?.label,
        }}
      >
        {children}
      </span>
    </label>
  )
})
