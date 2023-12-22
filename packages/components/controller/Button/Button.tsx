import { forwardRef, useEffect, useContext, useCallback } from 'react'
import { ButtonProps, ButtonRef } from './types'
import { ButtonGroupContext } from './context'
import { cn } from '../../../lib/utils'
import STYLES from './styles.module.css'

export const Button = forwardRef<ButtonRef, ButtonProps>((props, ref) => {
  const {
    value,
    disabled: _disabled = false,
    toggled: _toggled = false,
    classNames: _classNames,
    styles: _styles,
    className: _className,
    style: _style,
    onClick,
    onToggleChange,
    ...restProps
  } = props

  const groupContext = useContext(ButtonGroupContext)
  const isInGroup = groupContext !== null
  const disabled = isInGroup ? groupContext.disabled : _disabled

  let className, style, classNames, styles, toggled: boolean
  if (isInGroup) {
    className = _className || groupContext.classNames?.button
    style = _style || groupContext.styles?.button
    classNames = _classNames || groupContext.classNames
    styles = _styles || groupContext.styles
    toggled = groupContext.value?.length ? groupContext.value.includes(value) : _toggled
  } else {
    className = _className
    style = _style
    classNames = _classNames
    styles = _styles
    toggled = _toggled
  }

  useEffect(() => {
    if (disabled) return
    onToggleChange && onToggleChange(toggled)
  }, [toggled])

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      if (disabled) return
      onClick && onClick(e)

      if (!isInGroup || !value) return
      groupContext.onChange && groupContext.onChange(value)
    },
    [disabled, isInGroup, groupContext, value, onClick],
  )

  return (
    <button
      {...restProps}
      ref={ref}
      disabled={disabled}
      className={cn(
        STYLES['echo-button'],
        className,
        toggled && STYLES['echo-button__toggled'],
        toggled && classNames?.toggled,
        toggled && disabled && 'bg-muted',
      )}
      style={{
        ...style,
        ...(toggled && styles?.toggled),
      }}
      onClick={handleClick}
    >
      <span className={cn(disabled && 'text-foreground/60')}>{restProps.children}</span>
    </button>
  )
})
