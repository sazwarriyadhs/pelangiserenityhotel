"use client"

import React, { createContext, useContext, useState, ReactNode } from 'react'

export type Currency = 'USD' | 'IDR'

type CurrencyContextType = {
  currency: Currency
  setCurrency: (currency: Currency) => void
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined)

export function CurrencyProvider({ children, initialCurrency }: { children: ReactNode, initialCurrency: Currency }) {
  const [currency, setCurrency] = useState<Currency>(initialCurrency)
  return (
    <CurrencyContext.Provider value={{ currency, setCurrency }}>
      {children}
    </CurrencyContext.Provider>
  )
}

export function useCurrency() {
  const context = useContext(CurrencyContext)
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider')
  }
  return context
}
