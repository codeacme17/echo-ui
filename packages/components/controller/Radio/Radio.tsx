import { forwardRef, useCallback, useContext, useEffect, useState } from 'react'
import { usePropsWithGroup } from '../../../hooks/usePropsWithGroup'
import { cn } from '../../../lib/utils'
import { RadioChangeEvent, RadioGroupProps, RadioProps, RadioRef } from './types'
import { RadioGroupContext } from './context'
import { useStyle } from './styles'
import { COLOR, SIZE } from './constants'

export const Radio = forwardRef<RadioRef, RadioProps>((props, ref) => {
  const groupContext = useContext(RadioGroupContext)
  const isInGroup = groupContext !== null

  const {
    checked: _checked,
    value,
    children,
    disabled = false,
    size = SIZE,
    color = COLOR,
    classNames,
    styles,
    onChange,
    onClick,
    onMouseEnter,
    onMouseLeave,
    ...restProps
  } = usePropsWithGroup<RadioProps, RadioGroupProps>(props, groupContext)

  const [localChecked, setLocalChecked] = useState(_checked)

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
      className={cn(base(), restProps.className)}
      style={restProps.style}
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

      <div className={cn(label(), classNames?.label)} style={styles?.label}>
        {children}
      </div>
    </label>
  )
})
