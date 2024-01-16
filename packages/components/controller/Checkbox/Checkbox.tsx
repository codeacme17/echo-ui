import { forwardRef, useCallback, useContext, useEffect, useState } from 'react'
import { usePropsWithGroup } from '../../../lib/hooks'
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
    checked: _checked = false,
    disabled = false,
    size = SIZE,
    color = COLOR,
    classNames,
    styles,
    children,
    onClick,
    onChange,
    onMouseEnter,
    onMouseLeave,
    ...restProps
  } = usePropsWithGroup<CheckboxProps, CheckboxGroupProps>(props, groupContext, [
    'className',
    'style',
  ])

  const [checked, setChecked] = useState(_checked)

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (disabled) return

      setChecked(e.target.checked)

      const opt: CheckboxChangeEvent = {
        value: isInGroup ? value : e.target.checked,
        nativeEvent: e,
      }

      if (isInGroup) groupContext.onChange?.(opt)
      else onChange?.(opt)
    },
    [disabled, value, isInGroup, onChange, groupContext?.onChange],
  )

  useEffect(() => {
    if (isInGroup) {
      if (groupContext.value?.includes(value)) setChecked(true)
      else setChecked(false)
    } else setChecked(_checked)
  }, [groupContext?.value, _checked])

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

      <span className={cn(label(), classNames?.label)} style={styles?.label}>
        {children}
      </span>
    </label>
  )
})
