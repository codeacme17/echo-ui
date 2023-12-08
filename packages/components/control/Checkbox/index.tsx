import { memo, useContext } from 'react'
import { CheckboxProps, CheckboxGroupProps, CheckboxChangeEvent } from './types'
import { CheckboxGroupContext, CheckboxGroupContextProvider } from './context'
import { cn } from '../../../lib/utils'
import './styles.css'

export const CheckboxGroup = ({ value = [], ...props }: CheckboxGroupProps) => {
  const handleGroupChange = (option: CheckboxChangeEvent) => {
    const newValue = option.value
    const updatedValue = value.includes(newValue)
      ? value.filter((val) => val !== newValue)
      : [...value, newValue]

    props.onChange?.({
      value: updatedValue,
      nativeEvent: option.nativeEvent,
    })
  }

  return (
    <CheckboxGroupContextProvider
      value={{
        value: value,
        onChange: handleGroupChange,
        checkboxInputClassName: props.checkboxInputClassName,
        disabled: props.disabled,
      }}
    >
      <div className="echo-checkbox-group">{props.children}</div>
    </CheckboxGroupContextProvider>
  )
}

export const Checkbox = ({ disabled, checkboxInputClassName, ...props }: CheckboxProps) => {
  const groupContext = useContext(CheckboxGroupContext)
  const isInGroup = groupContext !== null

  if (isInGroup) {
    // If the user has specified a className for the checkbox input,
    // it will override the one which is specified in the group context
    checkboxInputClassName = checkboxInputClassName || groupContext!.checkboxInputClassName
    disabled = groupContext!.disabled || disabled
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return

    const opt: CheckboxChangeEvent = {
      value: props.value,
      nativeEvent: e,
    }

    if (isInGroup) groupContext.onChange?.(opt)
    else props.onChange?.(opt)
  }

  const checked = isInGroup ? groupContext.value!.includes(props.value) : props.checked

  return (
    <label className={cn('echo-checkbox', disabled && 'opacity-60 cursor-not-allowed')}>
      <input
        type="checkbox"
        className={cn('echo-checkbox-input', checkboxInputClassName)}
        disabled={disabled}
        checked={checked}
        onChange={handleChange}
      />

      <div className={cn('echo-checkbox-label')}>{props.children}</div>
    </label>
  )
}

Checkbox.Group = memo(CheckboxGroup)
