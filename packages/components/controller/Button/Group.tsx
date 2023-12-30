import { forwardRef } from 'react'
import { ButtonGroupContextProvider } from './context'
import { ButtonGroupRef, ButtonGroupProps } from './types'
import { cn } from '../../../lib/utils'
import { RADIUS, SIZE } from './constants'
import { useGroupStyle } from './styles'

export const ButtonGroup = forwardRef<ButtonGroupRef, ButtonGroupProps>((props, ref) => {
  const {
    value = [],
    disabled = false,
    size = SIZE,
    radius = RADIUS,
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
    size,
    radius,
    classNames,
    styles,
    onChange: handleGroupChange,
  }

  return (
    <ButtonGroupContextProvider value={contextValue}>
      <div ref={ref} className={cn(useGroupStyle(), className)} style={style}>
        {restProps.children}
      </div>
    </ButtonGroupContextProvider>
  )
})
