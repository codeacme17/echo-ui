import { forwardRef } from 'react'
import { CheckboxGroupProps, CheckboxChangeEvent, CheckboxGroupRef } from './types'
import { SIZE } from './constants'
import { CheckboxGroupContextProvider } from './context'
import { cn } from '../../../lib/utils'
import STYLES from './styles.module.css'

export const CheckboxGroup = forwardRef<CheckboxGroupRef, CheckboxGroupProps>((props, ref) => {
  const {
    value = [],
    disabled = false,
    size = SIZE,
    classNames,
    styles,
    onChange,
    ...restProps
  } = props

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

  const contextValue: CheckboxGroupProps = {
    value,
    disabled,
    size,
    classNames,
    styles,
    onChange: handleGroupChange,
  }

  return (
    <CheckboxGroupContextProvider value={contextValue}>
      <div
        {...restProps}
        ref={ref}
        className={cn(STYLES['echo-checkbox-group'], restProps.className)}
        style={{ ...restProps.style }}
      >
        {restProps.children}
      </div>
    </CheckboxGroupContextProvider>
  )
})
