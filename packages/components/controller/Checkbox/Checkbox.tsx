import { forwardRef, useCallback, useContext, useState } from 'react'
import { usePropsWithGroup } from '../../../hooks/usePropsWithGroup'
import { cn } from '../../../lib/utils'
import { CheckboxProps, CheckboxChangeEvent, CheckboxRef, CheckboxGroupProps } from './types'
import { CheckboxGroupContext } from './context'
import { useStyle } from './styles'
import { COLOR, SIZE } from './constants'

export const Checkbox = forwardRef<CheckboxRef, CheckboxProps>((props, ref) => {
  const groupContext = useContext(CheckboxGroupContext)
  const isInGroup = groupContext !== null

  const {
    value,
    children,
    checked: _checked,
    disabled = false,
    size = SIZE,
    color = COLOR,
    classNames,
    styles,
    onClick,
    onChange,
    onMouseEnter,
    onMouseLeave,
    ...restProps
  } = usePropsWithGroup<CheckboxProps, CheckboxGroupProps>(props, groupContext)

  const [localChecked, setLocalChecked] = useState(_checked)

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
      className={cn(base(), restProps.className)}
      style={restProps.style}
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

      <span className={cn(label(), classNames?.label)} style={styles?.label}>
        {children}
      </span>
    </label>
  )
})
