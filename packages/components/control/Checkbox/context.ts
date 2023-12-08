import { createContext } from 'react'
import { CheckboxGroupProps } from './types'

export const CheckboxGroupContext = createContext<CheckboxGroupProps | null>(null)
export const CheckboxGroupContextProvider = CheckboxGroupContext.Provider
