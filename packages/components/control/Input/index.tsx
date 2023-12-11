import { useState } from 'react'
import { InputProps } from './types'

export const Input = ({ value: initializeValue, onChange, ...props }: InputProps) => {
  const [value, setValue] = useState(initializeValue)

  return <section>Input</section>
}
