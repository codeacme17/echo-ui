import { forwardRef, useContext } from 'react'
import { cn } from '../../../lib/utils'
import { CheckboxProps, CheckboxChangeEvent } from './types'
import { CheckboxGroupContext } from './context'
import './styles.css'

/**
 * TODO
 * - Fix issue which click and change occure twice
 */

export const Checkbox = forwardRef<HTMLLabelElement, CheckboxProps>((props, ref) => {
  const {
    value,
    checked: _checked,
    disabled: _disabled,
    checkboxInputClassName: _checkboxInputClassName,
    onChange,
    ...restProps
  } = props

  const groupContext = useContext(CheckboxGroupContext)
  const isInGroup = groupContext !== null

  let checkboxInputClassName = _checkboxInputClassName
  let disabled = _disabled
  if (isInGroup) {
    // If the user has specified a className for the checkbox input,
    // it will override the one which is specified in the group context
    checkboxInputClassName = checkboxInputClassName || groupContext!.checkboxInputClassName
    disabled = groupContext!.disabled || disabled
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return

    const opt: CheckboxChangeEvent = {
      value: value,
      nativeEvent: e,
    }

    if (isInGroup) groupContext.onChange?.(opt)
    else onChange?.(opt)
  }

  const checked = isInGroup ? groupContext.value!.includes(value) : _checked

  return (
    <label
      ref={ref}
      className={cn(
        'echo-checkbox',
        disabled && 'opacity-60 cursor-not-allowed',
        restProps.className,
      )}
    >
      <input
        type="checkbox"
        className={cn('echo-checkbox-input', checkboxInputClassName)}
        disabled={disabled}
        checked={checked}
        onChange={handleChange}
      />

      <div className={cn('echo-checkbox-label')}>{restProps.children}</div>
    </label>
  )
})
