import { forwardRef, useCallback, useContext } from 'react'
import { cn } from '../../../lib/utils'
import { RadioChangeEvent, RadioProps, RadioRef } from './types'
import { RadioGroupContext } from './context'
import { radioStyle } from './styles'

export const Radio = forwardRef<RadioRef, RadioProps>((props, ref) => {
  const {
    value,
    children,
    disabled: _disabled,
    size: _size,
    classNames,
    styles,
    onChange,
    onClick,
    onMouseEnter,
    onMouseLeave,
    ...restProps
  }: RadioProps = props

  const groupContext = useContext(RadioGroupContext)
  const isInGroup = groupContext !== null
  const size = _size ? _size : groupContext?.size
  const disabled = _disabled === undefined ? groupContext?.disabled : _disabled
  const checked = isInGroup ? groupContext.value === value : props.checked

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (disabled) return

      const opt: RadioChangeEvent = { value, nativeEvent: e }
      if (isInGroup) groupContext.onChange?.(opt)
      else onChange?.(opt)
    },
    [onChange, disabled, groupContext],
  )

  return (
    <label
      ref={ref}
      data-checked={checked}
      data-disabled={disabled}
      className={cn(
        radioStyle({ size, disabled }).base(),
        isInGroup && groupContext.classNames?.radio,
        restProps.className,
      )}
      style={{
        ...(isInGroup && groupContext.styles?.radio),
        ...restProps.style,
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <input
        {...restProps}
        type="radio"
        checked={checked}
        disabled={disabled}
        onClick={onClick}
        onChange={handleChange}
        className={cn(
          radioStyle({ size }).button(),
          isInGroup && groupContext.classNames?.button,
          classNames?.button,
        )}
        style={{
          ...(isInGroup && groupContext?.styles?.button),
          ...styles?.button,
          borderRadius: '50%',
        }}
      />

      <div
        className={cn(
          radioStyle({ size }).label(),
          isInGroup && groupContext.classNames?.label,
          classNames?.label,
        )}
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
