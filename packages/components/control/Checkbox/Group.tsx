import { forwardRef } from 'react'
import { cn } from '../../../lib/utils'
import { CheckboxGroupProps, CheckboxChangeEvent, CheckboxGroupRef } from './types'
import { CheckboxGroupContextProvider } from './context'
import styles from './styles.module.css'

export const CheckboxGroup = forwardRef<CheckboxGroupRef, CheckboxGroupProps>((props, ref) => {
  const { value = [], inputClassName, ...restProps }: CheckboxGroupProps = props

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
        inputClassName: inputClassName,
        disabled: props.disabled,
      }}
    >
      <div
        ref={ref}
        className={cn(styles['echo-checkbox-group'], restProps.className)}
        style={{ ...restProps.style }}
      >
        {restProps.children}
      </div>
    </CheckboxGroupContextProvider>
  )
})
