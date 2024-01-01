import { forwardRef, useCallback, useContext, useEffect, useState } from 'react'
import { cn } from '../../../lib/utils'
import { RadioChangeEvent, RadioProps, RadioRef } from './types'
import { RadioGroupContext } from './context'
import { useStyle } from './styles'

export const Radio = forwardRef<RadioRef, RadioProps>((props, ref) => {
  const {
    checked: _checked,
    value,
    children,
    disabled: _disabled,
    size: _size,
    color: _color = 'var(--echo-primary)',
    classNames,
    styles,
    onChange,
    onClick,
    onMouseEnter,
    onMouseLeave,
    ...restProps
  }: RadioProps = props

  const [localChecked, setLocalChecked] = useState(_checked)
  const groupContext = useContext(RadioGroupContext)
  const isInGroup = groupContext !== null
  const color = _color ? _color : groupContext?.color
  const size = _size ? _size : groupContext?.size
  const disabled = _disabled === undefined ? groupContext?.disabled : _disabled

  useEffect(() => {
    if (!isInGroup) setLocalChecked(_checked)
  }, [_checked])

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (disabled) return
      if (!isInGroup) setLocalChecked(e.target.checked)

      const opt: RadioChangeEvent = { value, nativeEvent: e }
      if (isInGroup) groupContext.onChange?.(opt)
      else onChange?.(opt)
    },
    [onChange, disabled, groupContext],
  )

  const checked = isInGroup ? groupContext.value === value : localChecked

  const { base, wrapper, button, thumb, label } = useStyle({ checked, size, disabled })

  return (
    <label
      ref={ref}
      data-checked={checked}
      data-disabled={disabled}
      className={cn(base(), isInGroup && groupContext.classNames?.radio, restProps.className)}
      style={{
        ...(isInGroup && groupContext.styles?.radio),
        ...restProps.style,
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <span className={cn(wrapper())}>
        <input
          {...restProps}
          type="radio"
          checked={checked}
          disabled={disabled}
          onClick={onClick}
          onChange={handleChange}
          className={cn(button())}
        />

        <span
          className={cn(thumb())}
          style={{ backgroundColor: disabled ? 'var(--echo-muted)' : color }}
        />
      </span>

      <div
        className={cn(label(), isInGroup && groupContext.classNames?.label, classNames?.label)}
        style={{
          ...(isInGroup && groupContext.styles?.label),
          ...styles?.label,
        }}
      >
        {children}
      </div>
    </label>
  )
})
