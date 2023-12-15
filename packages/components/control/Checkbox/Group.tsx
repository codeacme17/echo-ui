import { forwardRef } from 'react'
import { CheckboxGroupProps, CheckboxChangeEvent, CheckboxGroupRef } from './types'
import { BUTTON_BORDER_WIDTH, BUTTON_COLOR, CHECKED_COLOR, SIZE } from './constants'
import { CheckboxGroupContextProvider } from './context'
import { cn } from '../../../lib/utils'
import styles from './styles.module.css'

export const CheckboxGroup = forwardRef<CheckboxGroupRef, CheckboxGroupProps>((props, ref) => {
  const {
    value = [],
    disabled = false,
    checkboxClassName,
    checkboxStyle,
    size = SIZE,
    buttonColor = BUTTON_COLOR,
    buttonBorderWidth = BUTTON_BORDER_WIDTH,
    checkedColor = CHECKED_COLOR,
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

  return (
    <CheckboxGroupContextProvider
      value={{
        value: value,
        disabled,
        size,
        buttonColor,
        buttonBorderWidth,
        checkboxClassName,
        checkboxStyle,
        checkedColor,
        onChange: handleGroupChange,
      }}
    >
      <div
        {...restProps}
        ref={ref}
        className={cn(styles['echo-checkbox-group'], restProps.className)}
        style={{ ...restProps.style }}
      >
        {restProps.children}
      </div>
    </CheckboxGroupContextProvider>
  )
})
