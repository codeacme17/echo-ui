import { forwardRef } from 'react'
import { KnobGroupContextProvider } from './context'
import { KnobGroupProps, KnobGroupRef } from './types'
import { cn } from '../../../lib/utils'

export const KnobGroup = forwardRef<KnobGroupRef, KnobGroupProps>((props, ref) => {
  const { value = [], onChange, onChangeEnd, ...restProps } = props

  const contextValue: KnobGroupProps = {
    ...restProps,
    value,
    onChange,
    onChangeEnd,
  }

  return (
    <KnobGroupContextProvider value={contextValue}>
      <div {...restProps} ref={ref} className={cn('', restProps.className)} style={restProps.style}>
        {restProps.children}
      </div>
    </KnobGroupContextProvider>
  )
})
