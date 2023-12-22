import { forwardRef } from 'react'
import { ButtonGroupContextProvider } from './context'
import { ButtonGroupRef, ButtonGroupProps } from './types'
import styles from './styles.module.css'
import { cn } from '../../../lib/utils'

export const ButtonGroup = forwardRef<ButtonGroupRef, ButtonGroupProps>((props, ref) => {
  const {
    values = [],
    disabled = false,
    classNames: _classNames,
    styles: _styles,
    className,
    style,
    onChange,
    ...restProps
  } = props

  const contextValue: ButtonGroupProps = {
    values,
    disabled,
    classNames: _classNames,
    styles: _styles,
    onChange,
  }

  return (
    <ButtonGroupContextProvider value={contextValue}>
      <div ref={ref} className={cn(styles['echo-button-group'], className)} style={style}>
        {restProps.children}
      </div>
    </ButtonGroupContextProvider>
  )
})
