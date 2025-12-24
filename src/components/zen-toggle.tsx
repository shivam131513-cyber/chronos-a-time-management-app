'use client'

import { useGameStore } from '@/lib/store/use-game-store'
import { Eye, EyeOff } from 'lucide-react'

export function ZenToggle() {
    const { isZenMode, toggleZenMode } = useGameStore()

    return (
        <button
            onClick={toggleZenMode}
            className={`
        flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-300
        ${isZenMode
                    ? 'bg-blue-500/20 border-blue-500/50 text-blue-200 shadow-[0_0_15px_rgba(59,130,246,0.5)]'
                    : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10 hover:text-white'}
      `}
        >
            {isZenMode ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            <span className="text-xs font-bold uppercase tracking-wider">
                {isZenMode ? 'Zen Active' : 'Zen Mode'}
            </span>
        </button>
    )
}
