'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function completeTask(taskId: string) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Unauthorized' }

    try {
        // 1. Mark task as completed
        const { data: task, error: taskError } = await supabase
            .from('tasks')
            .update({
                status: 'Completed',
                completed_at: new Date().toISOString()
            })
            .eq('id', taskId)
            .eq('user_id', user.id)
            .select()
            .single()

        if (taskError) throw taskError

        // 2. Calculate XP (Check for Double XP Effect)
        let xpAmount = 10 // Base XP

        const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single()

        // Check active effects
        if (profile?.active_effects?.double_xp_until) {
            const expiry = new Date(profile.active_effects.double_xp_until)
            if (expiry > new Date()) {
                xpAmount *= 2 // Double it!
            }
        }

        // 3. Award XP
        if (profile) {
            await supabase
                .from('profiles')
                .update({ total_xp: (profile.total_xp || 0) + xpAmount })
                .eq('id', user.id)
        }

        // 4. Log gamification event
        await supabase
            .from('gamification_logs')
            .insert({
                user_id: user.id,
                xp_change: xpAmount,
                reason: `Completed task: ${task.title}`
            })

        // 5. Check for Badges (The Logic Engine)
        // We import dynamically to avoid circular deps if any, though here it's fine
        const { checkAndAwardBadges } = await import('@/lib/gamification/check-badges')
        const newBadges = await checkAndAwardBadges(user.id, supabase)

        revalidatePath('/dashboard')
        return { success: true, xpEarned: xpAmount, newBadges }
    } catch (error) {
        console.error('Complete Task Error:', error)
        return { error: 'Failed to complete task' }
    }
}
