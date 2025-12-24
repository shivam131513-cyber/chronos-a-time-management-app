import { createClient } from '@/lib/supabase/server'
import AppLayout from '@/components/app-layout'
import { getBadges, getUserBadges } from '@/app/actions/achievements'
import { BadgeCard } from '@/components/badge-card'
import { Trophy, Medal, Star } from 'lucide-react'
import { redirect } from 'next/navigation'

export default async function AchievementsPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) redirect('/login')

    const [badges, userBadges, { data: profile }] = await Promise.all([
        getBadges(),
        getUserBadges(user.id),
        supabase.from('profiles').select('*').eq('id', user.id).single()
    ])

    const unlockedIds = new Set(userBadges.map(ub => ub.badge_id))
    const unlockedCount = unlockedIds.size
    const totalCount = badges.length
    const progressPercentage = totalCount > 0 ? (unlockedCount / totalCount) * 100 : 0

    return (
        <AppLayout>
            <div className="mb-8">
                <div className="flex items-end justify-between mb-6">
                    <div>
                        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-amber-200 mb-2">
                            Hall of Legends
                        </h1>
                        <p className="text-white/60">Your eternal glory, recorded forever.</p>
                    </div>

                    <div className="text-right">
                        <div className="text-3xl font-bold text-white">{unlockedCount} / {totalCount}</div>
                        <div className="text-xs text-white/40 uppercase tracking-wider">Badges Unlocked</div>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="h-2 bg-white/5 rounded-full overflow-hidden mb-12">
                    <div
                        className="h-full bg-gradient-to-r from-yellow-500 to-amber-500 transition-all duration-1000"
                        style={{ width: `${progressPercentage}%` }}
                    />
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-3 gap-4 mb-12">
                    <div className="bg-white/5 rounded-xl p-6 border border-white/10 flex flex-col items-center text-center">
                        <Trophy className="w-8 h-8 text-yellow-400 mb-2" />
                        <div className="text-2xl font-bold text-white">{profile?.total_xp || 0}</div>
                        <div className="text-xs text-white/40 uppercase">Total XP</div>
                    </div>
                    <div className="bg-white/5 rounded-xl p-6 border border-white/10 flex flex-col items-center text-center">
                        <Medal className="w-8 h-8 text-blue-400 mb-2" />
                        <div className="text-2xl font-bold text-white">{profile?.gamification_tier || 'Novice'}</div>
                        <div className="text-xs text-white/40 uppercase">Current Rank</div>
                    </div>
                    <div className="bg-white/5 rounded-xl p-6 border border-white/10 flex flex-col items-center text-center">
                        <Star className="w-8 h-8 text-purple-400 mb-2" />
                        <div className="text-2xl font-bold text-white">{profile?.max_streak || 0}</div>
                        <div className="text-xs text-white/40 uppercase">Best Streak</div>
                    </div>
                </div>

                {/* Badges Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {badges.map(badge => {
                        const isUnlocked = unlockedIds.has(badge.id)
                        const userBadge = userBadges.find(ub => ub.badge_id === badge.id)

                        return (
                            <BadgeCard
                                key={badge.id}
                                badge={badge}
                                isUnlocked={isUnlocked}
                                earnedAt={userBadge?.earned_at}
                            />
                        )
                    })}
                </div>
            </div>
        </AppLayout>
    )
}
