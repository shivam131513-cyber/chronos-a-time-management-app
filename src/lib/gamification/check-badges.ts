import { createClient } from '@/lib/supabase/server'

export async function checkAndAwardBadges(userId: string, supabaseClient?: any) {
    const supabase = supabaseClient || await createClient()

    // 1. Fetch User Stats
    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

    const { count: totalTasks } = await supabase
        .from('tasks')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('status', 'Completed')

    const { count: totalTemplates } = await supabase
        .from('task_templates')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)

    // 2. Fetch All Badges
    const { data: allBadges } = await supabase.from('badges').select('*')

    // 3. Fetch User's Existing Badges
    const { data: userBadges } = await supabase
        .from('user_badges')
        .select('badge_id')
        .eq('user_id', userId)

    const ownedBadgeIds = new Set(userBadges?.map((ub: any) => ub.badge_id))
    const newBadges = []

    // 4. Check Conditions
    for (const badge of allBadges || []) {
        if (ownedBadgeIds.has(badge.id)) continue

        let earned = false

        switch (badge.condition_type) {
            case 'TotalTasks':
                if ((totalTasks || 0) >= badge.condition_value) earned = true
                break
            case 'Streak':
                if ((profile?.current_streak || 0) >= badge.condition_value) earned = true
                break
            case 'RRule':
                if ((totalTemplates || 0) >= badge.condition_value) earned = true
                break
        }

        if (earned) {
            // Award Badge
            await supabase.from('user_badges').insert({
                user_id: userId,
                badge_id: badge.id
            })

            // Award XP for Badge
            if (badge.xp_reward > 0) {
                await supabase.rpc('increment_xp', { // Assuming we might make this RPC later, or manual update
                    user_uuid: userId,
                    amount: badge.xp_reward
                }).catch(async () => {
                    // Fallback manual update if RPC doesn't exist
                    const { data: p } = await supabase.from('profiles').select('total_xp').eq('id', userId).single()
                    await supabase.from('profiles').update({ total_xp: (p?.total_xp || 0) + badge.xp_reward }).eq('id', userId)
                })
            }

            newBadges.push(badge)
        }
    }

    return newBadges
}
