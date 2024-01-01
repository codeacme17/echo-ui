import { forwardRef, useCallback, useContext, useState } from 'react'
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
    color: _color,
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
  const [localChecked, setLocalChecked] = useState(_checked)
  const disabled = _disabled === undefined ? groupContext?.disabled : _disabled
  const size = _size ? _size : groupContext?.size
  const color = _color ? _color : groupContext?.color

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (disabled) return

      setLocalChecked(e.target.checked)

      const opt: CheckboxChangeEvent = {
        value: isInGroup ? value : e.target.checked,
        nativeEvent: e,
      }

      if (isInGroup) groupContext.onChange?.(opt)
      else onChange?.(opt)
    },
    [disabled, value, isInGroup, onChange, groupContext?.onChange],
  )

  const checked = isInGroup ? groupContext.value!.includes(value) : _checked ?? localChecked

  const { base, button, label, wrapper, thumb } = useStyle({ size, disabled, checked })

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
      <span className={cn(wrapper())}>
        <input
          {...restProps}
          type="checkbox"
          disabled={disabled}
          checked={checked}
          onChange={handleChange}
          className={cn(button())}
        />

        <span
          className={cn(thumb())}
          style={{ backgroundColor: disabled ? 'var(--echo-muted)' : color }}
        />
      </span>

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
