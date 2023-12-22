import { forwardRef } from 'react'
import { ButtonGroupContextProvider } from './context'
import { ButtonGroupRef, ButtonGroupProps } from './types'
import { cn } from '../../../lib/utils'
import STYLES from './styles.module.css'

export const ButtonGroup = forwardRef<ButtonGroupRef, ButtonGroupProps>((props, ref) => {
  const {
    value = [],
    disabled = false,
    classNames,
    styles,
    className,
    style,
    onChange,
    ...restProps
  } = props

  const handleGroupChange = (v: any) => {
    const newValue = v
    const updatedValue = value.includes(newValue)
      ? value.filter((val) => val !== newValue)
      : [...value, newValue]

    onChange?.(updatedValue)
  }

  const contextValue: ButtonGroupProps = {
    value,
    disabled,
    classNames,
    styles,
    onChange: handleGroupChange,
  }

  return (
    <ButtonGroupContextProvider value={contextValue}>
      <div ref={ref} className={cn(STYLES['echo-button-group'], className)} style={style}>
        {restProps.children}
      </div>
    </ButtonGroupContextProvider>
  )
})
