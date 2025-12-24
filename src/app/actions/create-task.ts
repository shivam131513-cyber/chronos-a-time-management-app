'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { RRule } from 'rrule'

const createTaskSchema = z.object({
    title: z.string().min(1),
    rrule: z.string().optional(), // e.g. "FREQ=WEEKLY;BYDAY=FR"
    due_date: z.string().optional(), // ISO string
})

export async function createTask(formData: FormData) {
    const supabase = await createClient()

    // Get current user
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        return { error: 'Unauthorized' }
    }

    const rawData = {
        title: formData.get('title'),
        rrule: formData.get('rrule') || undefined,
        due_date: formData.get('due_date') || undefined,
    }

    const validated = createTaskSchema.safeParse(rawData)
    if (!validated.success) {
        return { error: 'Invalid data' }
    }

    const { title, rrule, due_date } = validated.data

    try {
        if (rrule) {
            // 1. Create Template
            const { data: template, error: templateError } = await supabase
                .from('task_templates')
                .insert({
                    user_id: user.id,
                    title,
                    rrule,
                    next_generation_date: new Date().toISOString()
                })
                .select()
                .single()

            if (templateError) throw templateError

            // 2. Generate first instance immediately (optional but good UX)
            // Parse rrule to find next occurrence
            const rule = RRule.fromString(rrule)
            const nextDate = rule.after(new Date(), true) || new Date()

            const { error: taskError } = await supabase
                .from('tasks')
                .insert({
                    template_id: template.id,
                    user_id: user.id,
                    title,
                    due_date: nextDate.toISOString(),
                    status: 'Pending',
                    is_generated: true
                })

            if (taskError) throw taskError

        } else {
            // One-off task
            const { error } = await supabase
                .from('tasks')
                .insert({
                    user_id: user.id,
                    title,
                    due_date: due_date || new Date().toISOString(),
                    status: 'Pending',
                    is_generated: false
                })

            if (error) throw error
        }

        revalidatePath('/dashboard')
        return { success: true }
    } catch (error) {
        console.error('Create Task Error:', error)
        return { error: 'Failed to create task' }
    }
}
