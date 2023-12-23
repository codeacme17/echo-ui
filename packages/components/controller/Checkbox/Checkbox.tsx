import { forwardRef, useCallback, useContext, useMemo } from 'react'
import { CheckboxProps, CheckboxChangeEvent, CheckboxRef } from './types'
import { CheckboxGroupContext } from './context'
import { cn } from '../../../lib/utils'
import STYLES from './styles.module.css'

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

  const sizeClassNames = useMemo(() => {
    if (size === 'sm') return { button: 'w-4 h-4 border-[3px]', label: 'text-sm' }
    if (size === 'lg') return { button: 'w-6 h-6 border-[5px]', label: 'text-lg' }
    return { button: 'w-5 h-5 border-4', label: 'text-md' }
  }, [size])

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
      {/* I called it button although its a input element */}
      <input
        {...restProps}
        type="checkbox"
        disabled={disabled}
        checked={checked}
        onChange={handleChange}
        className={cn(
          STYLES['echo-checkbox-button'],
          sizeClassNames.button,
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
          sizeClassNames.label,
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
