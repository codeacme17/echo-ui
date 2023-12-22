import { forwardRef, useCallback, useContext } from 'react'
import { CheckboxProps, CheckboxChangeEvent, CheckboxRef } from './types'
import { BUTTON_BORDER_WIDTH, BUTTON_COLOR, CHECKED_COLOR, SIZE } from './constants'
import { CheckboxGroupContext } from './context'
import { cn } from '../../../lib/utils'
import STYLES from './styles.module.css'

export const Checkbox = forwardRef<CheckboxRef, CheckboxProps>((props, ref) => {
  const {
    value,
    children,
    checked: _checked,
    disabled: _disabled = false,
    size: _size,
    checkedColor: _checkedColor,
    buttonColor: _buttonColor,
    buttonBorderWidth: _buttonBorderWidth,
    className: _className,
    style: _style,
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

  let className = _className
  let style = _style
  let size = _size
  let checkedColor = _checkedColor
  let buttonColor = _buttonColor
  let buttonBorderWidth = _buttonBorderWidth

  if (isInGroup) {
    className = className || groupContext.className
    style = style || groupContext.style
    size = size || groupContext.size
    checkedColor = checkedColor || groupContext.checkedColor
    buttonColor = buttonColor || groupContext.buttonColor
    buttonBorderWidth = buttonBorderWidth || groupContext.buttonBorderWidth
  } else {
    size = size || SIZE
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
    [onChange, disabled, groupContext, value, isInGroup],
  )

  const getBackgroundColor = useCallback(() => {
    if (checked) {
      if (disabled) return 'var(--echo-muted)'
      else return checkedColor
    } else return buttonColor
  }, [checked, disabled, checkedColor, buttonColor])

  return (
    <label
      ref={ref}
      className={cn(
        STYLES['echo-checkbox'],
        disabled && STYLES['echo-checkbox__disabled'],
        className,
      )}
      style={style}
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
          backgroundColor: getBackgroundColor(),
          borderColor: buttonColor,
          borderWidth: buttonBorderWidth,
          width: size,
          height: size,
        }}
      />

      <span className={cn(STYLES['echo-checkbox-label'])}>{children}</span>
    </label>
  )
})
