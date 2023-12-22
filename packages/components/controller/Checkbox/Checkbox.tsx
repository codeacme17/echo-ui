import { forwardRef, useCallback, useContext, useMemo } from 'react'
import { CheckboxProps, CheckboxChangeEvent, CheckboxRef } from './types'
import { BUTTON_BORDER_WIDTH, BUTTON_COLOR, CHECKED_COLOR, BUTTON_SIZE } from './constants'
import { CheckboxGroupContext } from './context'
import { cn } from '../../../lib/utils'
import STYLES from './styles.module.css'

export const Checkbox = forwardRef<CheckboxRef, CheckboxProps>((props, ref) => {
  const {
    value,
    checked: _checked,
    disabled: _disabled = false,
    checkedColor: _checkedColor,
    buttonSize: _buttonSize,
    buttonColor: _buttonColor,
    buttonBorderWidth: _buttonBorderWidth,
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

  let checkedColor = _checkedColor
  let buttonSize = _buttonSize
  let buttonColor = _buttonColor
  let buttonBorderWidth = _buttonBorderWidth

  if (isInGroup) {
    buttonSize = buttonSize || groupContext.buttonSize
    checkedColor = checkedColor || groupContext.checkedColor
    buttonColor = buttonColor || groupContext.buttonColor
    buttonBorderWidth = buttonBorderWidth || groupContext.buttonBorderWidth
  } else {
    buttonSize = buttonSize || BUTTON_SIZE
    buttonColor = buttonColor || BUTTON_COLOR
    buttonBorderWidth = buttonBorderWidth || BUTTON_BORDER_WIDTH
    checkedColor = checkedColor || CHECKED_COLOR
  }

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

  const backgroundColor = useMemo(() => {
    if (!checked) return buttonColor
    if (disabled) return 'var(--echo-muted)'
    else return checkedColor
  }, [checked, disabled, checkedColor, buttonColor])

  return (
    <label
      ref={ref}
      className={cn(
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
        className={cn(STYLES['echo-checkbox-button'])}
        style={{
          backgroundColor,
          borderColor: buttonColor,
          borderWidth: buttonBorderWidth,
          width: buttonSize,
          height: buttonSize,
        }}
      />

      <span className={cn(STYLES['echo-checkbox-label'])}>{restProps.children}</span>
    </label>
  )
})
