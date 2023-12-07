import { useContext, memo } from 'react'
import { RadioGroupProps, RadioProps } from './types'
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

export const Radio = ({ value, onChange, children, ...props }: RadioProps) => {
  const groupContext = useContext(RadioGroupContext)
  const isInGroup = groupContext !== null

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const opt = {
      target: { value },
      nativeEvent: e,
    }

    if (isInGroup) {
      groupContext.onChange?.(opt)
    } else {
      onChange?.(opt)
    }
  }

  const checked = isInGroup ? groupContext.value === value : props.checked

  return (
    <label className="cursor-pointer flex">
      <input
        type="radio"
        className="cursor-pointer"
        onChange={handleChange}
        checked={checked}
        value={value}
        {...props}
      />
      <span className="text-foreground text-sm ml-2">{children}</span>
    </label>
  )
}

Radio.group = memo(RadioGroup)
