import { createContext } from 'react'
import { VuMeterContextProps } from './types'

export const VuMeterContext = createContext<VuMeterContextProps | null>(null)
export const VuMeterContextProvider = VuMeterContext.Provider
