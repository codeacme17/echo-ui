import { forwardRef, useContext } from 'react'
import { RadioChangeEvent, RadioProps, RadioRef } from './types'
import { RadioGroupContext } from './context'
import { cn } from '../../../lib/utils'
import './styles.css'

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return

    const opt: RadioChangeEvent = {
      value,
      nativeEvent: e,
    }

    console.log('trigger')

    if (isInGroup) groupContext.onChange?.(opt)
    else onChange?.(opt)
  }

  const handleClick = (e: React.MouseEvent<HTMLInputElement>) => {
    handleChange(e as unknown as React.ChangeEvent<HTMLInputElement>)
  }

  return (
    <label
      ref={ref}
      className={cn('echo-radio', disabled && 'opacity-60 cursor-not-allowed', restProps.className)}
      style={restProps.style}
    >
      <input
        type="radio"
        className={cn('echo-radio-input', radioInputClassName)}
        checked={checked}
        disabled={disabled}
        onChange={handleChange}
        onClick={handleClick}
      />

      <div className={cn('echo-radio-label')}>{restProps.children}</div>
    </label>
  )
})
