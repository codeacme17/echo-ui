import { forwardRef } from 'react'
import { ButtonGroupContextProvider } from './context'
import { ButtonGroupRef, ButtonGroupProps } from './types'
import styles from './styles.module.css'
import { cn } from '../../../lib/utils'

export const ButtonGroup = forwardRef<ButtonGroupRef, ButtonGroupProps>((props, ref) => {
  const { values = [], disabled = false, onChange, ...restProps } = props

  const contextValue: ButtonGroupProps = {
    values,
    disabled,
    onChange,
  }

  return (
    <ButtonGroupContextProvider value={contextValue}>
      <div ref={ref} className={cn(styles['echo-button-group'])}>
        {restProps.children}
      </div>
    </ButtonGroupContextProvider>
  )
})
