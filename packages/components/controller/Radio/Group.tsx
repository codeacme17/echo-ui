import { forwardRef } from 'react'
import { cn } from '../../../lib/utils'
import { RadioGroupProps, RadioGroupRef } from './types'
import { RadioGroupContextProvider } from './context'
import { useGroupStyle } from './styles'
import { SIZE } from './constants'

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
        className={cn(useGroupStyle(), restProps.className)}
        style={restProps.style}
      >
        {restProps.children}
      </div>
    </RadioGroupContextProvider>
  )
})
