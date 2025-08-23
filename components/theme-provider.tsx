'use client'

import * as React from 'react'
import {
  ThemeProvider as NextThemesProvider,
  type ThemeProviderProps,
} from 'next-themes'
import { ClientOnly } from './client-only'

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <ClientOnly
      fallback={
        <div className="min-h-screen bg-background text-foreground antialiased">
          {children}
        </div>
      }
    >
      <NextThemesProvider {...props}>{children}</NextThemesProvider>
    </ClientOnly>
  )
}
