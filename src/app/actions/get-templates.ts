'use server'

import { createClient } from '@/lib/supabase/server'

export type TaskTemplate = {
    id: string
    title: string
    rrule: string
    created_at: string
}

export async function getTemplates(): Promise<TaskTemplate[]> {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return []

    const { data, error } = await supabase
        .from('task_templates')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching templates:', error)
        return []
    }

    return data as TaskTemplate[]
}
