import { forwardRef, useCallback, useContext } from 'react'
import { RadioChangeEvent, RadioProps, RadioRef } from './types'
import { RadioGroupContext } from './context'
import { cn } from '../../../lib/utils'
import styles from './styles.module.css'

export const Radio = forwardRef<RadioRef, RadioProps>((props, ref) => {
  const {
    value,
    children,
    disabled: _disabled,
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
  if (isInGroup) {
    className = className || groupContext!.radioClassName
    style = style || groupContext!.radioStyle
    disabled = groupContext!.disabled || disabled
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
      />

      <div className={cn(styles['echo-radio-label'])}>{children}</div>
    </label>
  )
})
