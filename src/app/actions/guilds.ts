'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export type Guild = {
    id: string
    name: string
    description: string | null
    total_xp: number
    level: number
    leader_id: string | null
    created_at: string
    member_count?: number
}

export type GuildMember = {
    id: string
    email: string
    total_xp: number
    gamification_tier: string
}

export async function getGuilds() {
    const supabase = await createClient()

    // Fetch guilds
    const { data: guilds, error } = await supabase
        .from('guilds')
        .select('*')
        .order('total_xp', { ascending: false })

    if (error) {
        console.error('Error fetching guilds:', error)
        return []
    }

    // Fetch member counts (separate query for now as Supabase count relations can be tricky with simple clients)
    // Ideally we'd use a view or a join count, but for MVP we'll just fetch profiles
    const guildsWithCounts = await Promise.all(guilds.map(async (guild) => {
        const { count } = await supabase
            .from('profiles')
            .select('*', { count: 'exact', head: true })
            .eq('guild_id', guild.id)

        return { ...guild, member_count: count || 0 }
    }))

    return guildsWithCounts as Guild[]
}

export async function getUserGuild(userId: string) {
    const supabase = await createClient()

    // Get user's guild_id
    const { data: profile } = await supabase
        .from('profiles')
        .select('guild_id')
        .eq('id', userId)
        .single()

    if (!profile?.guild_id) return null

    // Get Guild Details
    const { data: guild } = await supabase
        .from('guilds')
        .select('*')
        .eq('id', profile.guild_id)
        .single()

    if (!guild) return null

    // Get Members
    const { data: members } = await supabase
        .from('profiles')
        .select('id, total_xp, gamification_tier') // We can't easily get email from profiles table unless we joined auth.users which is restricted usually.
        // Wait, we need email/name. Let's assume we can't get email directly from profiles if it's not there.
        // For now, let's just show XP and Tier.
        .eq('guild_id', guild.id)
        .order('total_xp', { ascending: false })

    // To get emails, we might need a secure function or just rely on what we have. 
    // Let's check if we can get auth info. Usually client can't select from auth.users.
    // We will proceed with just displaying generic "Member" or if we stored display_name in profiles (we didn't yet).
    // Let's just return the profile data we have.

    return { ...guild, members }
}

export async function createGuild(name: string, description: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { success: false, message: 'Not authenticated' }

    // Check if user is already in a guild
    const { data: profile } = await supabase
        .from('profiles')
        .select('guild_id')
        .eq('id', user.id)
        .single()

    if (profile?.guild_id) return { success: false, message: 'You are already in a guild' }

    // Create Guild
    const { data: guild, error } = await supabase
        .from('guilds')
        .insert({
            name,
            description,
            leader_id: user.id,
            total_xp: 0,
            level: 1
        })
        .select()
        .single()

    if (error) {
        console.error('Create guild error:', error)
        return { success: false, message: error.message }
    }

    // Add creator to guild
    await supabase
        .from('profiles')
        .update({ guild_id: guild.id })
        .eq('id', user.id)

    revalidatePath('/guilds')
    return { success: true, message: 'Guild created!' }
}

export async function joinGuild(guildId: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { success: false, message: 'Not authenticated' }

    const { data: profile } = await supabase
        .from('profiles')
        .select('guild_id')
        .eq('id', user.id)
        .single()

    if (profile?.guild_id) return { success: false, message: 'You are already in a guild' }

    const { error } = await supabase
        .from('profiles')
        .update({ guild_id: guildId })
        .eq('id', user.id)

    if (error) return { success: false, message: error.message }

    revalidatePath('/guilds')
    return { success: true, message: 'Joined guild!' }
}

export async function leaveGuild() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { success: false, message: 'Not authenticated' }

    await supabase
        .from('profiles')
        .update({ guild_id: null })
        .eq('id', user.id)

    revalidatePath('/guilds')
    return { success: true, message: 'Left guild' }
}
