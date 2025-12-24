'use client'

import { Guild, leaveGuild } from '@/app/actions/guilds'
import { Users, LogOut, Shield, Trophy } from 'lucide-react'
import { useState } from 'react'

export function GuildDashboard({ guild }: { guild: any }) {
    const [isLoading, setIsLoading] = useState(false)

    const handleLeave = async () => {
        if (!confirm('Are you sure you want to leave this guild?')) return
        setIsLoading(true)
        await leaveGuild()
        setIsLoading(false)
    }

    return (
        <div className="space-y-8">
            {/* Guild Header */}
            <div className="bg-gradient-to-r from-blue-900/40 to-purple-900/40 border border-white/10 rounded-2xl p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Shield className="w-64 h-64" />
                </div>

                <div className="relative z-10">
                    <div className="flex justify-between items-start">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <h1 className="text-4xl font-bold text-white">{guild.name}</h1>
                                <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs font-bold uppercase tracking-wider border border-blue-500/20">
                                    Level {guild.level}
                                </span>
                            </div>
                            <p className="text-white/60 text-lg max-w-2xl">{guild.description}</p>
                        </div>
                        <button
                            onClick={handleLeave}
                            disabled={isLoading}
                            className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
                        >
                            <LogOut className="w-4 h-4" />
                            Leave Guild
                        </button>
                    </div>

                    <div className="mt-8 flex items-center gap-8">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-white/5 rounded-lg">
                                <Trophy className="w-6 h-6 text-yellow-400" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-white">{guild.total_xp}</div>
                                <div className="text-xs text-white/40 uppercase">Guild XP</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-white/5 rounded-lg">
                                <Users className="w-6 h-6 text-blue-400" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-white">{guild.members?.length || 0}</div>
                                <div className="text-xs text-white/40 uppercase">Members</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Members List */}
            <div>
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <Users className="w-5 h-5 text-blue-400" />
                    Roster
                </h2>
                <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-white/5 text-xs text-white/40 uppercase font-bold">
                            <tr>
                                <th className="p-4">Rank</th>
                                <th className="p-4">Member ID</th>
                                <th className="p-4">Tier</th>
                                <th className="p-4 text-right">Contribution (XP)</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {guild.members?.map((member: any, index: number) => (
                                <tr key={member.id} className="hover:bg-white/5 transition-colors">
                                    <td className="p-4 text-white/60">#{index + 1}</td>
                                    <td className="p-4 font-mono text-sm text-white/80">
                                        {member.id.slice(0, 8)}...
                                        {member.id === guild.leader_id && (
                                            <span className="ml-2 text-[10px] bg-yellow-500/20 text-yellow-400 px-1.5 py-0.5 rounded border border-yellow-500/20">LEADER</span>
                                        )}
                                    </td>
                                    <td className="p-4">
                                        <span className={`
                                            text-xs px-2 py-1 rounded-full border
                                            ${member.gamification_tier === 'Grandmaster' ? 'bg-purple-500/20 border-purple-500/30 text-purple-300' :
                                                member.gamification_tier === 'Master' ? 'bg-red-500/20 border-red-500/30 text-red-300' :
                                                    'bg-white/5 border-white/10 text-white/50'}
                                        `}>
                                            {member.gamification_tier}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right font-bold text-white">{member.total_xp}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
