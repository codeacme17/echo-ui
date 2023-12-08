import { useContext, memo } from 'react'
import { RadioChangeEvent, RadioGroupProps, RadioProps } from './types'
import { RadioGroupContext, RadioGroupContextProvider } from './context'
import { cn } from '../../../lib/utils'
import './styles.css'

const RadioGroup = ({ ...props }: RadioGroupProps) => {
  return (
    <RadioGroupContextProvider
      value={{
        value: props.value || Infinity,
        defaultValue: props.defaultValue,
        onChange: props.onChange,
        disabled: props.disabled,
        radioInputClassName: props.radioInputClassName,
      }}
    >
      <div className={cn('echo-radio-group', props.className)} style={props.style}>
        {props.children}
      </div>
    </RadioGroupContextProvider>
  )
}

export const Radio = ({ value, onChange, disabled, radioInputClassName, ...props }: RadioProps) => {
  const groupContext = useContext(RadioGroupContext)
  const isInGroup = groupContext !== null

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

    if (isInGroup) groupContext.onChange?.(opt)
    else onChange?.(opt)
  }

  const handleClick = (e: React.MouseEvent<HTMLInputElement>) => {
    handleChange(e as unknown as React.ChangeEvent<HTMLInputElement>)
  }

  return (
    <label
      className={cn('echo-radio', disabled && 'opacity-60 cursor-not-allowed', props.className)}
      style={props.style}
    >
      <input
        type="radio"
        className={cn('echo-radio-input', radioInputClassName)}
        checked={checked}
        disabled={disabled}
        onChange={handleChange}
        onClick={handleClick}
      />

      <div className={cn('echo-radio-label')}>{props.children}</div>
    </label>
  )
}

Radio.group = memo(RadioGroup)
