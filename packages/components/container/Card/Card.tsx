import { forwardRef } from 'react'
import { CardProps, CardRef } from './types'
import { cn } from '../../../lib/utils'
import styles from './styles.module.css'

export const Card = forwardRef<CardRef, CardProps>((props, ref) => {
  const { children, className, style, ...restProps } = props

  return (
    <div {...restProps} ref={ref} className={cn(styles['echo-card'], className)} style={style}>
      {children}
    </div>
  )
})
