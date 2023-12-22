import { forwardRef } from 'react'
import { ButtonGroupContextProvider } from './context'
import { ButtonGroupRef, ButtonGroupProps } from './types'

export const ButtonGroup = forwardRef<ButtonGroupRef, ButtonGroupProps>((props, ref) => {
  const { ...restProps } = props

  return (
    <ButtonGroupContextProvider value={{}}>
      <div ref={ref}>{restProps.children}</div>
    </ButtonGroupContextProvider>
  )
})
