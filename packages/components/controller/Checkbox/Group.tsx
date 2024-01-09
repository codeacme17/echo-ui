import { forwardRef } from 'react'
import { cn } from '../../../lib/utils'
import { CheckboxGroupProps, CheckboxChangeEvent, CheckboxGroupRef } from './types'
import { CheckboxGroupContextProvider } from './context'
import { checkboxGroupStyle } from './styles'
import { COLOR, SIZE } from './constants'

export const CheckboxGroup = forwardRef<CheckboxGroupRef, CheckboxGroupProps>((props, ref) => {
  const {
    value = [],
    disabled = false,
    size = SIZE,
    color = COLOR,
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
    color,
    classNames,
    styles,
    className: classNames?.checkbox,
    style: styles?.checkbox,
    onChange: handleGroupChange,
  }

  return (
    <CheckboxGroupContextProvider value={contextValue}>
      <div
        {...restProps}
        ref={ref}
        className={cn(checkboxGroupStyle(), restProps.className)}
        style={restProps.style}
      >
        {restProps.children}
      </div>
    </CheckboxGroupContextProvider>
  )
})
