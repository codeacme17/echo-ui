import { forwardRef, useCallback, useContext } from 'react'
import { RadioChangeEvent, RadioProps, RadioRef } from './types'
import { RadioGroupContext } from './context'
import { cn } from '../../../lib/utils'
import styles from './styles.module.css'

export const Radio = forwardRef<RadioRef, RadioProps>((props, ref) => {
  const {
    value,
    onChange,
    disabled: _disabled,
    radioInputClassName: _radioInputClassName,
    ...restProps
  }: RadioProps = props

  const groupContext = useContext(RadioGroupContext)
  const isInGroup = groupContext !== null

  let radioInputClassName = _radioInputClassName
  let disabled = _disabled
  if (isInGroup) {
    // If the user has specified a className for the checkbox input,
    // it will override the one which is specified in the group context
    radioInputClassName = radioInputClassName || groupContext!.radioInputClassName
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
      className={cn(
        styles['echo-radio'],
        disabled && styles['echo-radio__disabled'],
        restProps.className,
      )}
      style={restProps.style}
    >
      <input
        type="radio"
        className={cn(
          styles['echo-radio-input'],
          disabled && styles['echo-radio-input__disabled'],
          radioInputClassName,
        )}
        checked={checked}
        disabled={disabled}
        onChange={handleChange}
        onClick={handleClick}
      />

      <div className={cn(styles['echo-radio-label'])}>{restProps.children}</div>
    </label>
  )
})
