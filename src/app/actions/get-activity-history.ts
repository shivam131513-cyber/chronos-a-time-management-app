'use server'

import { createClient } from '@/lib/supabase/server'

export type ActivityDay = {
    date: string
    count: number
}

export async function getActivityHistory(days: number = 365): Promise<ActivityDay[]> {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return []

    // Calculate start date
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    const { data, error } = await supabase
        .from('tasks')
        .select('completed_at')
        .eq('user_id', user.id)
        .eq('status', 'Completed')
        .gte('completed_at', startDate.toISOString())

    if (error) {
        console.error('Error fetching activity history:', error)
        return []
    }

    // Group by date
    const activityMap = new Map<string, number>()

    data.forEach(task => {
        if (task.completed_at) {
            const date = new Date(task.completed_at).toISOString().split('T')[0]
            activityMap.set(date, (activityMap.get(date) || 0) + 1)
        }
    })

    // Fill in missing days if needed, or just return the sparse data
    // For a heatmap, it's often easier to return sparse data and let the UI fill gaps,
    // but returning a full array makes the UI simpler. Let's return sparse for now to save bandwidth
    // and handle the "grid" logic in the UI.

    return Array.from(activityMap.entries()).map(([date, count]) => ({
        date,
        count
    }))
}
