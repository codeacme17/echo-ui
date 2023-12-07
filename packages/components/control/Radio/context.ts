import { createContext } from 'react'
import { RadioGroupProps } from './types'

export const RadioGroupContext = createContext<RadioGroupProps | null>(null)
export const RadioGroupContextProvider = RadioGroupContext.Provider
