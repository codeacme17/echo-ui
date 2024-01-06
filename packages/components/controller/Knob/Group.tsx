import { forwardRef } from 'react'
import { cn } from '../../../lib/utils'
import { KnobGroupContextProvider } from './context'
import { KnobGroupProps, KnobGroupRef } from './types'
import { knobGroupStyle } from './styles'

export const KnobGroup = forwardRef<KnobGroupRef, KnobGroupProps>((props, ref) => {
  const {
    disabled,
    progressColor,
    pointerColor,
    size,
    trackWidth,
    trackColor,
    buttonColor,
    pointerWidth,
    pointerHeight,
    bilateral,
    sensitivity,
    step,
    min,
    max,
    classNames,
    styles,
    ...restProps
  } = props

  const contextValue: KnobGroupProps = {
    disabled,
    progressColor,
    pointerColor,
    size,
    trackWidth,
    trackColor,
    buttonColor,
    pointerWidth,
    pointerHeight,
    bilateral,
    sensitivity,
    step,
    min,
    max,
    classNames,
    styles,
    ...restProps,
  }

  return (
    <KnobGroupContextProvider value={contextValue}>
      <div
        {...restProps}
        ref={ref}
        className={cn(knobGroupStyle(), restProps.className)}
        style={restProps.style}
      >
        {restProps.children}
      </div>
    </KnobGroupContextProvider>
  )
})
