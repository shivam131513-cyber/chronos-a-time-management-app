import { createClient } from '@/lib/supabase/server'
import AppLayout from '@/components/app-layout'
import { getGuilds, getUserGuild } from '@/app/actions/guilds'
import { GuildBrowser } from '@/components/guild-browser'
import { GuildDashboard } from '@/components/guild-dashboard'
import { redirect } from 'next/navigation'

export default async function GuildsPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) redirect('/login')

    const [userGuild, allGuilds] = await Promise.all([
        getUserGuild(user.id),
        getGuilds()
    ])

    return (
        <AppLayout>
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-cyan-200 mb-2">
                    Guild Hall
                </h1>
                <p className="text-white/60">Forge alliances. Conquer together.</p>
            </div>

            {userGuild ? (
                <GuildDashboard guild={userGuild} />
            ) : (
                <GuildBrowser guilds={allGuilds} />
            )}
        </AppLayout>
    )
}
