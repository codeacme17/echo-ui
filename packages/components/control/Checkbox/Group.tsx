import { forwardRef } from 'react'
import { CheckboxGroupProps, CheckboxChangeEvent } from './types'
import { CheckboxGroupContextProvider } from './context'
import { cn } from '../../../lib/utils'
import './styles.css'

export const CheckboxGroup = forwardRef<HTMLDivElement, CheckboxGroupProps>((props, ref) => {
  const { value = [], checkboxInputClassName, ...restProps }: CheckboxGroupProps = props

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
        checkboxInputClassName: checkboxInputClassName,
        disabled: props.disabled,
      }}
    >
      <div ref={ref} className={cn('echo-checkbox-group', restProps.className)}>
        {restProps.children}
      </div>
    </CheckboxGroupContextProvider>
  )
})
