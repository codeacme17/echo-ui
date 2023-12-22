import { forwardRef, useEffect, useContext, useMemo, useCallback } from 'react'
import { ButtonProps, ButtonRef } from './types'
import { ButtonGroupContext } from './context'
import { cn } from '../../../lib/utils'
import styles from './styles.module.css'

export const Button = forwardRef<ButtonRef, ButtonProps>((props, ref) => {
  const {
    value,
    disabled = false,
    toggled: _toggled = false,
    classNames,
    styles: _styles,
    children,
    className,
    style,
    onClick,
    onChange,
    ...restProps
  } = props

  const groupContext = useContext(ButtonGroupContext)
  const isInGroup = groupContext !== null
  const toggled = useMemo(
    () => (isInGroup ? groupContext.values!.includes(value) : _toggled),
    [isInGroup, _toggled, value, groupContext?.values],
  )

  useEffect(() => {
    if (disabled) return
    onChange && onChange(toggled)
  }, [toggled])

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      if (disabled) return
      onClick && onClick(e)

      if (!isInGroup) return
      let newValues
      const values = groupContext.values || []
      if (values.includes(value)) newValues = values.filter((v) => v !== value)
      else newValues = [...values, value]

      groupContext.onChange && groupContext.onChange(newValues)
    },
    [disabled, isInGroup, groupContext, value, onClick],
  )

  return (
    <button
      {...restProps}
      ref={ref}
      disabled={disabled}
      className={cn(
        styles['echo-button'],
        className,
        toggled && styles['echo-button__toggled'],
        toggled && classNames?.toggled,
      )}
      style={{
        ...style,
        ...(toggled && _styles?.toggled),
      }}
      onClick={handleClick}
    >
      <span className={cn(disabled && 'text-foreground/60')}>{children}</span>
    </button>
  )
})
