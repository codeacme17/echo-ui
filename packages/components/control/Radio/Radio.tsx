import { forwardRef, useCallback, useContext } from 'react'
import { RadioChangeEvent, RadioProps, RadioRef } from './types'
import { BUTTON_BORDER_WIDTH, BUTTON_COLOR, CHECKED_COLOR, SIZE } from './constants'
import { RadioGroupContext } from './context'
import { cn } from '../../../lib/utils'
import styles from './styles.module.css'

export const Radio = forwardRef<RadioRef, RadioProps>((props, ref) => {
  const {
    value,
    children,
    disabled: _disabled,
    size: _size,
    buttonColor: _buttonColor,
    buttonBorderWidth: _buttonBorderWidth,
    checkedColor: _checkedColor,
    className: _className,
    style: _style,
    onChange,
    onMouseEnter,
    onMouseLeave,
    ...restProps
  }: RadioProps = props

  const groupContext = useContext(RadioGroupContext)
  const isInGroup = groupContext !== null

  let disabled = _disabled
  let className = _className
  let style = _style
  let buttonColor = _buttonColor
  let checkedColor = _checkedColor
  let buttonBorderWidth = _buttonBorderWidth
  let size = _size
  if (isInGroup) {
    className = className || groupContext.radioClassName
    style = style || groupContext.radioStyle
    buttonColor = buttonColor || groupContext.buttonColor
    buttonBorderWidth = buttonBorderWidth || groupContext.buttonBorderWidth
    checkedColor = checkedColor || groupContext.checkedColor
    size = size || groupContext.size
    disabled = groupContext.disabled || disabled
  } else {
    buttonColor = buttonColor || BUTTON_COLOR
    buttonBorderWidth = buttonBorderWidth || BUTTON_BORDER_WIDTH
    checkedColor = checkedColor || CHECKED_COLOR
    size = size || SIZE
  }

  const checked = isInGroup ? groupContext.value === value : props.checked

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (disabled) return

      const opt: RadioChangeEvent = {
        value,
        nativeEvent: e,
      }

      if (isInGroup) groupContext.onChange?.(opt)
      else onChange?.(opt)
    },
    [onChange, disabled, groupContext],
  )

  const handleClick = (e: React.MouseEvent<HTMLInputElement>) => {
    handleChange(e as unknown as React.ChangeEvent<HTMLInputElement>)
  }

  const getBackgroundColor = useCallback(() => {
    if (checked) {
      if (disabled) return 'var(--echo-muted)'
      else return checkedColor
    } else return buttonColor
  }, [checked, disabled, checkedColor, buttonColor])

  return (
    <label
      ref={ref}
      className={cn(styles['echo-radio'], disabled && styles['echo-radio__disabled'], className)}
      style={style}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <input
        {...restProps}
        type="radio"
        className={cn(styles['echo-radio-input'])}
        checked={checked}
        disabled={disabled}
        onChange={handleChange}
        onClick={handleClick}
        style={{
          backgroundColor: getBackgroundColor(),
          borderColor: buttonColor,
          borderWidth: buttonBorderWidth,
          width: size,
          height: size,
        }}
      />

      <div className={cn(styles['echo-radio-label'])}>{children}</div>
    </label>
  )
})
