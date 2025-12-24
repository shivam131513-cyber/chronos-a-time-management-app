'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'

const QUOTES = [
    "The obstacle is the way.",
    "Time is the most valuable thing a man can spend.",
    "Focus is the key to all power.",
    "Do or do not. There is no try.",
    "Your future is created by what you do today, not tomorrow.",
    "Discipline is freedom.",
    "The only way to do great work is to love what you do.",
    "Simplicity is the ultimate sophistication.",
    "Make it so.",
    "I must not fear. Fear is the mind-killer."
]

export function OracleQuote() {
    const [quote, setQuote] = useState('')
    const [displayQuote, setDisplayQuote] = useState('')

    useEffect(() => {
        // Pick a random quote on mount
        const randomQuote = QUOTES[Math.floor(Math.random() * QUOTES.length)]
        setQuote(randomQuote)
        setDisplayQuote('')

        let i = 0
        const interval = setInterval(() => {
            if (i <= randomQuote.length) {
                setDisplayQuote(randomQuote.slice(0, i))
                i++
            } else {
                clearInterval(interval)
            }
        }, 50) // Typewriter speed

        return () => clearInterval(interval)
    }, [])

    return (
        <div className="relative group">
            {/* Animated Glow Background */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-xl blur opacity-20 group-hover:opacity-60 transition duration-1000 group-hover:duration-200 animate-tilt"></div>

            {/* Glass Card */}
            <div className="relative flex items-center gap-4 p-4 rounded-xl bg-black/40 border border-white/10 backdrop-blur-md shadow-2xl">
                <div className="p-2.5 rounded-full bg-gradient-to-br from-white/10 to-white/5 border border-white/10 shadow-inner">
                    <Sparkles className="w-4 h-4 text-blue-300 animate-pulse" />
                </div>

                <div className="font-medium text-sm text-blue-100/90 min-h-[20px] min-w-[200px] tracking-wide shadow-black/50 drop-shadow-sm">
                    {displayQuote}
                    <motion.span
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{ repeat: Infinity, duration: 0.8 }}
                        className="inline-block w-0.5 h-4 bg-blue-400 ml-1 align-middle shadow-[0_0_8px_rgba(96,165,250,0.8)]"
                    />
                </div>
            </div>
        </div>
    )
}
