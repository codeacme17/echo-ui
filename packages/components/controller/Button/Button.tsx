import { forwardRef, useEffect, useContext, useCallback } from 'react'
import { ButtonProps, ButtonRef } from './types'
import { ButtonGroupContext } from './context'
import { cn } from '../../../lib/utils'
import styleModule from './styles.module.css'

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
  const toggled = isInGroup ? groupContext.values!.includes(value) : _toggled
  const disabled = isInGroup ? groupContext.disabled : _disabled

  let className = _className
  let style = _style
  let classNames = _classNames
  let styles = _styles

  if (isInGroup) {
    className = className || groupContext!.classNames?.button
    style = style || groupContext!.styles?.button
    classNames = _classNames || groupContext!.classNames
    styles = _styles || groupContext!.styles
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
        styleModule['echo-button'],
        className,
        toggled && styleModule['echo-button__toggled'],
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
