import { forwardRef } from 'react'
import { RadioGroupProps, RadioGroupRef } from './types'
import { RadioGroupContextProvider } from './context'
import { BUTTON_COLOR, CHECKED_COLOR, BUTTON_BORDER_WIDTH, SIZE } from './constants'
import { cn } from '../../../lib/utils'
import styles from './styles.module.css'

export const RadioGroup = forwardRef<RadioGroupRef, RadioGroupProps>((props, ref) => {
  const {
    value,
    defaultValue,
    disabled,
    radioClassName,
    radioStyle,
    size = SIZE,
    buttonColor = BUTTON_COLOR,
    buttonBorderWidth = BUTTON_BORDER_WIDTH,
    checkedColor = CHECKED_COLOR,
    onChange,
    ...restProps
  }: RadioGroupProps = props

  return (
    <RadioGroupContextProvider
      value={{
        value: value || Infinity,
        defaultValue,
        radioClassName,
        radioStyle,
        size,
        buttonColor,
        buttonBorderWidth,
        checkedColor,
        disabled,
        onChange,
      }}
    >
      <div
        {...restProps}
        ref={ref}
        className={cn(styles['echo-radio-group'], restProps.className)}
        style={restProps.style}
      >
        {restProps.children}
      </div>
    </RadioGroupContextProvider>
  )
})
