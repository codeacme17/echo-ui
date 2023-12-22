import { forwardRef } from 'react'
import { RadioGroupProps, RadioGroupRef } from './types'
import { RadioGroupContextProvider } from './context'
import { BUTTON_COLOR, CHECKED_COLOR, BUTTON_BORDER_WIDTH, SIZE } from './constants'
import { cn } from '../../../lib/utils'
import STYLES from './styles.module.css'

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

  const contextValue: RadioGroupProps = {
    value,
    defaultValue,
    radioClassName,
    radioStyle,
    size,
    buttonColor,
    buttonBorderWidth,
    checkedColor,
    disabled,
    onChange,
  }

  return (
    <RadioGroupContextProvider value={contextValue}>
      <div
        {...restProps}
        ref={ref}
        className={cn(STYLES['echo-radio-group'], restProps.className)}
        style={restProps.style}
      >
        {restProps.children}
      </div>
    </RadioGroupContextProvider>
  )
})
