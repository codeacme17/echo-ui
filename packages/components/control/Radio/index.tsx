import { useContext } from 'react'
import { RadioChangeEvent, RadioGroupProps, RadioProps } from './types'
import { RadioGroupContext, RadioGroupContextProvider } from './context'
import { cn } from '../../../lib/utils'

const RadioGroup = ({ value, defaultValue, onChange, ...props }: RadioGroupProps) => {
  return (
    <RadioGroupContextProvider
      value={{
        value,
        defaultValue,
        onChange,
      }}
    >
      <div className={cn(props.className)}>{props.children}</div>
    </RadioGroupContextProvider>
  )
}

export const Radio = ({ ...props }: RadioProps) => {
  const groupContext = useContext(RadioGroupContext)

  const value = props.value || 0
  let selectedValue: any = 0

  const onChange = (e: RadioChangeEvent) => {
    props.onChange?.(e)
    groupContext?.onChange?.(e)
  }

  const radioProps = { ...props }

  if (groupContext) {
    selectedValue = groupContext.value || groupContext.defaultValue || 0
    radioProps.checked = value === selectedValue
    radioProps.onChange = onChange
  } else {
    console.log(value)
    radioProps.checked = !!value
  }

  const handleChange = (e: MouseEvent) => {
    radioProps.onChange({ target: { value }, nativeEvent: e })
  }

  return (
    <label className="cursor-pointer flex">
      <input
        type="radio"
        className="cursor-pointer"
        onChange={handleChange}
        checked={radioProps.checked}
      />

      <span className="text-foreground text-sm ml-2">{props.children}</span>
    </label>
  )
}

Radio.group = RadioGroup
