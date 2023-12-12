import { forwardRef } from 'react'
import { RadioGroupProps, RadioGroupRef } from './types'
import { RadioGroupContextProvider } from './context'
import { cn } from '../../../lib/utils'
import './styles.css'

export const RadioGroup = forwardRef<RadioGroupRef, RadioGroupProps>((props, ref) => {
  const {
    value,
    defaultValue,
    onChange,
    disabled,
    radioInputClassName,
    ...restProps
  }: RadioGroupProps = props

  return (
    <RadioGroupContextProvider
      value={{
        value: value || Infinity,
        defaultValue: defaultValue,
        onChange: onChange,
        disabled: disabled,
        radioInputClassName: radioInputClassName,
      }}
    >
      <div
        ref={ref}
        className={cn('echo-radio-group', restProps.className)}
        style={restProps.style}
      >
        {restProps.children}
      </div>
    </RadioGroupContextProvider>
  )
})
