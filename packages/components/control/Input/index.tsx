import { useState } from 'react'
import { InputProps } from './types'
import { handleValueType } from './utils'
import { cn } from '../../../lib/utils'
import './styles.css'

export const Input = ({
  value: initializeValue,
  onChange,
  type = 'text',
  placeholder,
  ...props
}: InputProps) => {
  const [value, setValue] = useState(initializeValue)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value)
    onChange && onChange({ value: handleValueType(e.target.value, type), nativeEvent: e })
  }

  return (
    <label className={cn('echo-input', props.className)}>
      <input
        type={type ? type : `text`}
        placeholder={placeholder}
        className={cn('echo-input-main', props.className)}
        onChange={handleChange}
      />
    </label>
  )
}
