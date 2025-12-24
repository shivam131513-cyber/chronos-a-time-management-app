'use client'

import { motion } from 'framer-motion'

interface DynamicBackgroundProps {
    streak: number
    theme?: string
}

export function DynamicBackground({ streak, theme = 'default' }: DynamicBackgroundProps) {
    // Determine gradient based on streak and theme
    const getGradient = () => {
        if (theme === 'cyberpunk') {
            return 'from-fuchsia-900/40 via-purple-900/40 to-cyan-900/40'
        }
        if (theme === 'zen') {
            return 'from-emerald-900/30 via-teal-900/30 to-stone-900/30'
        }

        // Default Streak-based
        if (streak >= 7) return 'from-yellow-900/20 via-orange-900/20 to-red-900/20' // God mode / High streak
        if (streak >= 3) return 'from-blue-900/20 via-purple-900/20 to-pink-900/20' // Medium streak
        return 'from-slate-900/20 via-blue-900/20 to-slate-900/20' // Low/No streak
    }

    return (
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 2 }}
                className={`absolute inset-0 bg-gradient-to-br ${getGradient()} transition-colors duration-[3000ms]`}
            />

            {/* Ambient Orbs - Colors adjust slightly or stay generic */}
            <motion.div
                animate={{
                    x: [0, 100, 0],
                    y: [0, -50, 0],
                    scale: [1, 1.2, 1]
                }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className={`absolute top-0 left-0 w-[500px] h-[500px] rounded-full blur-[100px] ${theme === 'cyberpunk' ? 'bg-cyan-500/10' : theme === 'zen' ? 'bg-emerald-500/10' : 'bg-blue-500/10'}`}
            />
            <motion.div
                animate={{
                    x: [0, -100, 0],
                    y: [0, 50, 0],
                    scale: [1, 1.5, 1]
                }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear", delay: 2 }}
                className={`absolute bottom-0 right-0 w-[600px] h-[600px] rounded-full blur-[120px] ${theme === 'cyberpunk' ? 'bg-fuchsia-500/10' : theme === 'zen' ? 'bg-stone-500/10' : 'bg-purple-500/10'}`}
            />
        </div>
    )
}
