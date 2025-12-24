'use server'

import { createClient } from '@/lib/supabase/server'

export type TaskHistoryItem = {
    id: string
    title: string
    completed_at: string
    status: 'Pending' | 'Completed'
}

export async function getTasksForDate(date: string): Promise<TaskHistoryItem[]> {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return []

    // Create start and end of the day in UTC
    const startDate = new Date(date)
    startDate.setUTCHours(0, 0, 0, 0)

    const endDate = new Date(date)
    endDate.setUTCHours(23, 59, 59, 999)

    const { data, error } = await supabase
        .from('tasks')
        .select('id, title, completed_at, status')
        .eq('user_id', user.id)
        .eq('status', 'Completed')
        .gte('completed_at', startDate.toISOString())
        .lte('completed_at', endDate.toISOString())
        .order('completed_at', { ascending: false })

    if (error) {
        console.error('Error fetching tasks for date:', error)
        return []
    }

    return data as TaskHistoryItem[]
}
