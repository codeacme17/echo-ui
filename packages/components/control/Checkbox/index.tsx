import { memo, useContext } from 'react'
import { CheckboxProps, CheckboxGroupProps, CheckboxChangeEvent } from './types'
import { CheckboxGroupContext, CheckboxGroupContextProvider } from './context'
import { cn } from '../../../lib/utils'
import './styles.css'

export const CheckboxGroup = ({
  value = [],
  onChange,
  checkboxInputClassName,
  children,
}: CheckboxGroupProps) => {
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
        checkboxInputClassName,
      }}
    >
      <div className="echo-checkbox-group">{children}</div>
    </CheckboxGroupContextProvider>
  )
}

export const Checkbox = ({ checkboxInputClassName, ...props }: CheckboxProps) => {
  const groupContext = useContext(CheckboxGroupContext)
  const isInGroup = groupContext !== null

  if (isInGroup) {
    // If the user has specified a className for the checkbox input,
    // it will override the one which is specified in the group context
    checkboxInputClassName = checkboxInputClassName || groupContext!.checkboxInputClassName
  }

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
    <label className="echo-checkbox">
      <input
        type="checkbox"
        className={cn('echo-checkbox-input', checkboxInputClassName)}
        checked={checked}
        onChange={handleChange}
      />

      <div className={cn('echo-checkbox-label')}>{props.children}</div>
    </label>
  )
}

Checkbox.Group = memo(CheckboxGroup)
