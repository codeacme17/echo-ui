import { forwardRef } from 'react'
import { cn } from '../../../lib/utils'
import { CardProps, CardRef, CardHeaderProps, CardBodyProps } from './types'
import { useStyle } from './styles'

export const Card = forwardRef<CardRef, CardProps>((props, ref) => {
  const { toggled = false, ...restProps } = props

  return (
    <div
      {...restProps}
      ref={ref}
      data-toggled={toggled}
      className={cn(useStyle({ toggled }).base(), restProps.className)}
      style={restProps.style}
    >
      {restProps.children}
    </div>
  )
})

export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>((props, ref) => {
  return (
    <div {...props} ref={ref} className={cn(useStyle().header(), props.className)}>
      {props.children}
    </div>
  )
})

export const CardBody = forwardRef<HTMLDivElement, CardBodyProps>((props, ref) => {
  return (
    <div {...props} ref={ref} className={cn(useStyle().body(), props.className)}>
      {props.children}
    </div>
  )
})
