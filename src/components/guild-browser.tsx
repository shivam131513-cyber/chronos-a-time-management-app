'use client'

import { Guild, joinGuild, createGuild } from '@/app/actions/guilds'
import { useState } from 'react'
import { Users, Plus, Search, Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'

export function GuildBrowser({ guilds }: { guilds: Guild[] }) {
    const [isCreating, setIsCreating] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [newGuildName, setNewGuildName] = useState('')
    const [newGuildDesc, setNewGuildDesc] = useState('')

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        try {
            const res = await createGuild(newGuildName, newGuildDesc)
            if (!res.success) alert(res.message)
            else setIsCreating(false)
        } finally {
            setIsLoading(false)
        }
    }

    const handleJoin = async (id: string) => {
        if (!confirm('Join this guild?')) return
        setIsLoading(true)
        try {
            const res = await joinGuild(id)
            if (!res.success) alert(res.message)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white">Active Guilds</h2>
                <button
                    onClick={() => setIsCreating(!isCreating)}
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg font-bold text-sm flex items-center gap-2 transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Create Guild
                </button>
            </div>

            {isCreating && (
                <motion.form
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    onSubmit={handleCreate}
                    className="bg-white/5 border border-white/10 p-6 rounded-xl space-y-4"
                >
                    <div>
                        <label className="block text-xs font-bold uppercase text-white/50 mb-1">Guild Name</label>
                        <input
                            type="text"
                            required
                            value={newGuildName}
                            onChange={e => setNewGuildName(e.target.value)}
                            className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                            placeholder="e.g. The Night's Watch"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase text-white/50 mb-1">Motto / Description</label>
                        <input
                            type="text"
                            value={newGuildDesc}
                            onChange={e => setNewGuildDesc(e.target.value)}
                            className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                            placeholder="We guard the realms of productivity."
                        />
                    </div>
                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={() => setIsCreating(false)}
                            className="px-4 py-2 text-white/50 hover:text-white"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="px-6 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg font-bold flex items-center gap-2"
                        >
                            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                            Create
                        </button>
                    </div>
                </motion.form>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {guilds.map(guild => (
                    <div key={guild.id} className="bg-white/5 border border-white/10 p-6 rounded-xl hover:border-white/20 transition-colors flex justify-between items-center group">
                        <div>
                            <h3 className="font-bold text-lg text-white group-hover:text-blue-300 transition-colors">{guild.name}</h3>
                            <p className="text-sm text-white/50 mb-2">{guild.description}</p>
                            <div className="flex items-center gap-4 text-xs text-white/40">
                                <span className="flex items-center gap-1">
                                    <Users className="w-3 h-3" />
                                    {guild.member_count} Members
                                </span>
                                <span>Lvl {guild.level}</span>
                                <span>{guild.total_xp} XP</span>
                            </div>
                        </div>
                        <button
                            onClick={() => handleJoin(guild.id)}
                            disabled={isLoading}
                            className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm font-medium text-white transition-colors"
                        >
                            Join
                        </button>
                    </div>
                ))}
            </div>
        </div>
    )
}
