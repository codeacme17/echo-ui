import { forwardRef } from 'react'
import { RadioGroupProps, RadioGroupRef } from './types'
import { RadioGroupContextProvider } from './context'
import { SIZE } from './constants'
import { cn } from '../../../lib/utils'
import STYLES from './styles.module.css'

export const RadioGroup = forwardRef<RadioGroupRef, RadioGroupProps>((props, ref) => {
  const {
    value,
    disabled = false,
    size = SIZE,
    classNames,
    styles,
    onChange,
    ...restProps
  }: RadioGroupProps = props

  const contextValue: RadioGroupProps = {
    value,
    size,
    disabled,
    classNames,
    styles,
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
