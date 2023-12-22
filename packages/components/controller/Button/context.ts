import { createContext } from 'react'
import { ButtonGroupProps } from './types'

export const ButtonGroupContext = createContext<ButtonGroupProps | null>(null)
export const ButtonGroupContextProvider = ButtonGroupContext.Provider
