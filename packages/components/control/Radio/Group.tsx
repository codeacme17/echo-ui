import { forwardRef } from 'react'
import { RadioGroupProps, RadioGroupRef } from './types'
import { RadioGroupContextProvider } from './context'
import { cn } from '../../../lib/utils'
import styles from './styles.module.css'

export const RadioGroup = forwardRef<RadioGroupRef, RadioGroupProps>((props, ref) => {
  const { value, defaultValue, disabled, onChange, ...restProps }: RadioGroupProps = props

  return (
    <RadioGroupContextProvider
      value={{
        value: value || Infinity,
        defaultValue: defaultValue,
        onChange: onChange,
        disabled: disabled,
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
