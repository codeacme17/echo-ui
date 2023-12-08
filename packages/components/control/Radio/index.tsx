import { useContext, memo } from 'react'
import { RadioChangeEvent, RadioGroupProps, RadioProps } from './types'
import { RadioGroupContext, RadioGroupContextProvider } from './context'
import { cn } from '../../../lib/utils'
import './styles.css'

const RadioGroup = ({ ...props }: RadioGroupProps) => {
  return (
    <RadioGroupContextProvider
      value={{
        value: props.value,
        defaultValue: props.defaultValue,
        onChange: props.onChange,
        disabled: props.disabled,
        radioButtonClassName: props.radioButtonClassName,
      }}
    >
      <div className={cn('echo-radio-group', props.className)} style={props.style}>
        {props.children}
      </div>
    </RadioGroupContextProvider>
  )
}

export const Radio = ({
  value,
  onChange,
  children,
  disabled,
  radioButtonClassName,
  ...props
}: RadioProps) => {
  const groupContext = useContext(RadioGroupContext)
  const isInGroup = groupContext !== null

  if (isInGroup) {
    radioButtonClassName = groupContext!.radioButtonClassName || radioButtonClassName
    disabled = groupContext!.disabled || disabled
  }

  const checked = isInGroup ? groupContext.value === value : props.checked

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
        className={cn('echo-radio-input', radioButtonClassName)}
        onChange={handleChange}
        onClick={handleClick}
        checked={checked}
        disabled={disabled}
        value={value}
      />
      {typeof children === 'string' ? (
        <span className={cn('echo-radio-label')}>{children}</span>
      ) : (
        children
      )}
    </label>
  )
}

Radio.group = memo(RadioGroup)
