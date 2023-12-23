import { forwardRef, useCallback, useContext } from 'react'
import { CheckboxProps, CheckboxChangeEvent, CheckboxRef } from './types'
import { CheckboxGroupContext } from './context'
import { cn } from '../../../lib/utils'
import STYLES from './styles.module.css'

export const Checkbox = forwardRef<CheckboxRef, CheckboxProps>((props, ref) => {
  const {
    value,
    checked: _checked,
    disabled: _disabled = false,
    classNames,
    styles,
    children,
    onChange,
    onMouseEnter,
    onMouseLeave,
    onClick,
    ...restProps
  } = props

  const groupContext = useContext(CheckboxGroupContext)
  const isInGroup = groupContext !== null
  const checked = isInGroup ? groupContext.value!.includes(value) : _checked
  const disabled = isInGroup ? groupContext.disabled : _disabled

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

  return (
    <label
      ref={ref}
      data-checked={checked}
      data-disabled={disabled}
      className={cn(
        'group',
        STYLES['echo-checkbox'],
        isInGroup && groupContext.classNames?.checkbox,
        restProps.className,
        disabled && STYLES['echo-checkbox__disabled'],
      )}
      style={{
        ...(isInGroup && groupContext.styles?.checkbox),
        ...restProps.style,
      }}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <input
        {...restProps}
        type="checkbox"
        disabled={disabled}
        checked={checked}
        onChange={handleChange}
        className={cn(
          STYLES['echo-checkbox-button'],
          checked && STYLES['echo-checkbox-button__checked'],
          disabled && STYLES['echo-checkbox-button__disabled'],
          isInGroup && groupContext.classNames?.button,
          classNames?.button,
        )}
        style={{
          ...(isInGroup && groupContext.styles?.button),
          ...styles?.button,
        }}
      />

      <span
        className={cn(
          STYLES['echo-checkbox-label'],
          isInGroup && groupContext.classNames?.label,
          classNames?.label,
        )}
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
