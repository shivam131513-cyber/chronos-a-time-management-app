'use client'

import { login, signup } from '@/app/actions/auth'
import { useState } from 'react'
import { Loader2 } from 'lucide-react'

export default function LoginPage() {
    const [isLoading, setIsLoading] = useState(false)
    const [mode, setMode] = useState<'login' | 'signup'>('login')
    const [error, setError] = useState<string | null>(null)

    async function handleSubmit(formData: FormData) {
        setIsLoading(true)
        setError(null)

        const action = mode === 'login' ? login : signup
        const res = await action(formData)

        if (res?.error) {
            setError(res.error)
            setIsLoading(false)
        }
        // If success, the action redirects, so no need to set loading false
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="w-full max-w-md glass p-8 rounded-2xl animate-in fade-in zoom-in duration-500">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-2">
                        Chronos
                    </h1>
                    <p className="text-white/60">
                        {mode === 'login' ? 'Welcome back, Traveler.' : 'Begin your journey.'}
                    </p>
                </div>

                <form action={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs uppercase tracking-wider text-white/50 mb-1.5">Email</label>
                        <input
                            name="email"
                            type="email"
                            required
                            placeholder="you@example.com"
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-blue-500/50 transition-colors"
                            suppressHydrationWarning
                        />
                    </div>

                    <div>
                        <label className="block text-xs uppercase tracking-wider text-white/50 mb-1.5">Password</label>
                        <input
                            name="password"
                            type="password"
                            required
                            placeholder="••••••••"
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-blue-500/50 transition-colors"
                            suppressHydrationWarning
                        />
                    </div>

                    {error && (
                        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-300 text-sm text-center">
                            {error}
                        </div>
                    )}

                    <button
                        disabled={isLoading}
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
                        suppressHydrationWarning
                    >
                        {isLoading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            mode === 'login' ? 'Enter Portal' : 'Create Account'
                        )}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <button
                        onClick={() => {
                            setMode(mode === 'login' ? 'signup' : 'login')
                            setError(null)
                        }}
                        className="text-sm text-white/40 hover:text-white transition-colors"
                        suppressHydrationWarning
                    >
                        {mode === 'login' ? "Don't have an account? Sign up" : "Already have an account? Login"}
                    </button>
                </div>
            </div>
        </div>
    )
}
