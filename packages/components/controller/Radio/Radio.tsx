import { forwardRef, useCallback, useContext, useMemo } from 'react'
import { RadioChangeEvent, RadioProps, RadioRef } from './types'
import { RadioGroupContext } from './context'
import { cn } from '../../../lib/utils'
import STYLES from './styles.module.css'

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
        STYLES['echo-radio'],
        isInGroup && groupContext.classNames?.radio,
        restProps.className,
        disabled && STYLES['echo-radio__disabled'],
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
          STYLES['echo-radio-button'],
          sizeClassNames.button,
          isInGroup && groupContext.classNames?.button,
          classNames?.button,
        )}
        style={{
          ...(isInGroup && groupContext?.styles?.button),
          ...styles?.button,
        }}
      />

      <div
        className={cn(
          STYLES['echo-radio-label'],
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
      </div>
    </label>
  )
})
