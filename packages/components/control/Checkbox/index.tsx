import { useContext } from 'react'
import { CheckboxProps, CheckboxGroupProps, CheckboxChangeEvent } from './types'
import { CheckboxGroupContext, CheckboxGroupContextProvider } from './context'

export const CheckboxGroup = ({ value = [], onChange, children }: CheckboxGroupProps) => {
  const handleGroupChange = (option: CheckboxChangeEvent) => {
    const newValue = option.value
    const updatedValue = value.includes(newValue)
      ? value.filter((val) => val !== newValue)
      : [...value, newValue]

    onChange?.({
      value: updatedValue,
      nativeEvent: option.nativeEvent,
    })
  }

  return (
    <CheckboxGroupContextProvider
      value={{
        value: value,
        onChange: handleGroupChange,
      }}
    >
      <div className="flex text-foreground">{children}</div>
    </CheckboxGroupContextProvider>
  )
}

export const Checkbox = ({ ...props }: CheckboxProps) => {
  const groupContext = useContext(CheckboxGroupContext)
  const isInGroup = groupContext !== null

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const opt: CheckboxChangeEvent = {
      value: props.value,
      nativeEvent: e,
    }

    if (isInGroup) groupContext.onChange?.(opt)
    else props.onChange?.(opt)
  }

  const checked = isInGroup ? groupContext.value!.includes(props.value) : props.checked

  return (
    <label>
      <input type="checkbox" checked={checked} onChange={handleChange} />

      {typeof props.children === 'string' ? <span>{props.children}</span> : props.children}
    </label>
  )
}

Checkbox.Group = CheckboxGroup
