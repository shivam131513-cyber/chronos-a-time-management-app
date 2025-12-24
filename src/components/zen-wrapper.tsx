'use client'

import { useGameStore } from '@/lib/store/use-game-store'
import { ReactNode } from 'react'

export function ZenWrapper({ children }: { children: ReactNode }) {
    const { isZenMode } = useGameStore()

    return (
        <div className={`transition-all duration-500 ${isZenMode ? '[&_.zen-blur]:blur-sm [&_.zen-blur]:opacity-30 [&_.zen-blur]:pointer-events-none' : ''}`}>
            {children}
        </div>
    )
}
