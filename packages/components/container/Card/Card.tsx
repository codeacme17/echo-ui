import { forwardRef } from 'react'
import { CardProps, CardRef, CardHeaderProps, CardBodyProps } from './types'
import { cn } from '../../../lib/utils'
import styles from './styles.module.css'

export const Card = forwardRef<CardRef, CardProps>((props, ref) => {
  const {
    toggled = false,
    children,
    toggledClassName,
    toggledStyle,
    className,
    style,
    ...restProps
  } = props

  return (
    <div
      {...restProps}
      ref={ref}
      className={cn(
        styles['echo-card'],
        className,
        toggled && styles['echo-card__toggled'],
        toggled && toggledClassName,
      )}
      style={toggled ? { ...style, ...toggledStyle } : { ...style }}
    >
      {children}
    </div>
  )
})

export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>((props, ref) => {
  return (
    <div {...props} ref={ref} className={cn(styles['echo-card-header'], props.className)}>
      {props.children}
    </div>
  )
})

export const CardBody = forwardRef<HTMLDivElement, CardBodyProps>((props, ref) => {
  return (
    <div {...props} ref={ref} className={cn(styles['echo-card-body'], props.className)}>
      {props.children}
    </div>
  )
})
