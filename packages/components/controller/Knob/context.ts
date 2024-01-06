import { createContext } from 'react'
import { KnobGroupProps } from './types'

export const KnobGroupContext = createContext<KnobGroupProps | null>(null)
export const KnobGroupContextProvider = KnobGroupContext.Provider
