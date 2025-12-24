'use server'

import { createClient } from '@/lib/supabase/server'

export type Badge = {
    id: string
    name: string
    description: string
    icon_url: string | null
    condition_type: 'Streak' | 'TotalTasks' | 'RRule'
    condition_value: number
    xp_reward: number
}

export type UserBadge = {
    badge_id: string
    earned_at: string
}

export async function getBadges() {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('badges')
        .select('*')
        .order('condition_value', { ascending: true })

    if (error) {
        console.error('Error fetching badges:', error)
        return []
    }

    return data as Badge[]
}

export async function getUserBadges(userId: string) {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('user_badges')
        .select('badge_id, earned_at')
        .eq('user_id', userId)

    if (error) {
        console.error('Error fetching user badges:', error)
        return []
    }

    return data as UserBadge[]
}
