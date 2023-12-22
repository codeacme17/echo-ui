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
    onChange,
    ...restProps
  } = props

  const groupContext = useContext(ButtonGroupContext)
  const isInGroup = groupContext !== null
  const toggled = isInGroup ? groupContext.value!.includes(value) : _toggled
  const disabled = isInGroup ? groupContext.disabled : _disabled

  let className, style, classNames, styles
  if (isInGroup) {
    className = className || groupContext!.classNames?.button
    style = style || groupContext!.styles?.button
    classNames = _classNames || groupContext!.classNames
    styles = _styles || groupContext!.styles
  } else {
    className = _className
    style = _style
    classNames = _classNames
    styles = _styles
  }

  useEffect(() => {
    if (disabled) return
    onChange && onChange(toggled)
  }, [toggled])

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      if (disabled) return
      onClick && onClick(e)

      if (!isInGroup) return
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
        'hover:bg-opacity-90',
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
