import { useContext, memo } from 'react'
import { RadioGroupProps, RadioProps } from './types'
import { RadioGroupContext, RadioGroupContextProvider } from './context'
import { cn } from '../../../lib/utils'
import './styles.css'

const RadioGroup = ({ value, defaultValue, onChange, ...props }: RadioGroupProps) => {
  return (
    <RadioGroupContextProvider
      value={{
        value,
        defaultValue,
        onChange,
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
  radioButtonClassName,
  ...props
}: RadioProps) => {
  const groupContext = useContext(RadioGroupContext)
  const isInGroup = groupContext !== null

  if (isInGroup) {
    radioButtonClassName = groupContext!.radioButtonClassName
  }

  const checked = isInGroup ? groupContext.value === value : props.checked

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const opt = {
      target: { value },
      nativeEvent: e,
    }

    if (isInGroup) groupContext.onChange?.(opt)
    else onChange?.(opt)
  }

  const handleClick = (e: React.MouseEvent<HTMLInputElement>) => {
    handleChange(e as unknown as React.ChangeEvent<HTMLInputElement>)
  }

  return (
    <label className={cn('echo-radio', props.className)} style={props.style}>
      <input
        type="radio"
        className={cn('echo-radio__input', radioButtonClassName)}
        onChange={handleChange}
        onClick={handleClick}
        checked={checked}
        value={value}
      />
      {typeof children === 'string' ? (
        <span className="text-foreground text-sm ml-2">{children}</span>
      ) : (
        children
      )}
    </label>
  )
}

Radio.group = memo(RadioGroup)
