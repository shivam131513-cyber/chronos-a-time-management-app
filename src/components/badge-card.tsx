'use client'

import { Badge } from '@/app/actions/achievements'
import { motion } from 'framer-motion'
import { Lock, Trophy } from 'lucide-react'

interface BadgeCardProps {
    badge: Badge
    isUnlocked: boolean
    earnedAt?: string
}

export function BadgeCard({ badge, isUnlocked, earnedAt }: BadgeCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`
                relative p-4 rounded-xl border transition-all duration-300 group
                ${isUnlocked
                    ? 'bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border-yellow-500/30 hover:border-yellow-500/50'
                    : 'bg-white/5 border-white/10 grayscale opacity-60 hover:opacity-80'}
            `}
        >
            <div className="flex items-start gap-4">
                <div className={`
                    w-12 h-12 rounded-full flex items-center justify-center border
                    ${isUnlocked
                        ? 'bg-yellow-500/20 border-yellow-500/40 text-yellow-400 shadow-[0_0_15px_rgba(234,179,8,0.3)]'
                        : 'bg-white/5 border-white/10 text-white/20'}
                `}>
                    {isUnlocked ? <Trophy className="w-6 h-6" /> : <Lock className="w-5 h-5" />}
                </div>

                <div className="flex-1">
                    <h3 className={`font-bold ${isUnlocked ? 'text-white' : 'text-white/50'}`}>
                        {badge.name}
                    </h3>
                    <p className="text-xs text-white/50 mt-1">{badge.description}</p>

                    <div className="mt-3 flex items-center justify-between text-xs">
                        <span className={`${isUnlocked ? 'text-yellow-400' : 'text-white/30'}`}>
                            +{badge.xp_reward} XP
                        </span>
                        {isUnlocked && earnedAt && (
                            <span className="text-white/30">
                                {new Date(earnedAt).toLocaleDateString()}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Shine effect for unlocked badges */}
            {isUnlocked && (
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-shimmer pointer-events-none" />
            )}
        </motion.div>
    )
}
