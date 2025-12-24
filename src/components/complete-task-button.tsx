'use client'

import { useState } from 'react'
import { Zap } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { completeTask } from '@/app/actions/complete-task'

interface CompleteTaskButtonProps {
    taskId: string
}

export function CompleteTaskButton({ taskId }: CompleteTaskButtonProps) {
    const [isCompleting, setIsCompleting] = useState(false)
    const [showXP, setShowXP] = useState(false)

    const handleComplete = async () => {
        setIsCompleting(true)
        setShowXP(true)

        // Simulate "Juicy" delay for animation
        setTimeout(async () => {
            await completeTask(taskId)
            // No need to set false, page will refresh/redirect
        }, 800)
    }

    return (
        <div className="relative">
            <AnimatePresence>
                {showXP && (
                    <motion.div
                        initial={{ opacity: 0, y: 0, scale: 0.5 }}
                        animate={{ opacity: 1, y: -50, scale: 1.5 }}
                        exit={{ opacity: 0 }}
                        className="absolute -top-10 left-1/2 -translate-x-1/2 text-yellow-400 font-bold text-xl z-50 pointer-events-none drop-shadow-[0_0_10px_rgba(250,204,21,0.5)]"
                    >
                        +50 XP
                    </motion.div>
                )}
            </AnimatePresence>

            <button
                onClick={handleComplete}
                disabled={isCompleting}
                className={`
          px-6 py-3 rounded-full font-bold transition-all duration-300 flex items-center gap-2
          ${isCompleting
                        ? 'bg-green-500 text-white scale-110 shadow-[0_0_20px_rgba(34,197,94,0.6)]'
                        : 'bg-white text-black hover:bg-blue-50 hover:scale-105 active:scale-95'}
        `}
            >
                {isCompleting ? 'Mission Complete!' : 'Complete Mission'}
                <Zap className={`w-4 h-4 ${isCompleting ? 'animate-bounce' : ''}`} />
            </button>

            {/* Simple Particle Explosion (CSS/Framer) */}
            {showXP && (
                <>
                    {[...Array(8)].map((_, i) => (
                        <motion.div
                            key={i}
                            initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                            animate={{
                                x: (Math.random() - 0.5) * 100,
                                y: (Math.random() - 0.5) * 100,
                                opacity: 0,
                                scale: 0
                            }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="absolute top-1/2 left-1/2 w-2 h-2 bg-yellow-400 rounded-full pointer-events-none"
                        />
                    ))}
                </>
            )}
        </div>
    )
}
