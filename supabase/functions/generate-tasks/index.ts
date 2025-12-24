import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { RRule } from 'https://esm.sh/rrule@2'

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const supabase = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        )

        // 1. Fetch active templates
        const { data: templates, error: templatesError } = await supabase
            .from('task_templates')
            .select('*')

        if (templatesError) throw templatesError

        const tasksToInsert = []
        const now = new Date()
        const windowEnd = new Date()
        windowEnd.setDate(windowEnd.getDate() + 30) // 30 day rolling window

        for (const template of templates) {
            try {
                // 2. Parse RRule
                const rule = RRule.fromString(template.rrule)

                // 3. Get occurrences between last generation (or now) and window end
                // For simplicity, we just look ahead from now. 
                // In a real app, we'd check 'next_generation_date' to avoid duplicates if run frequently.
                // Here we assume the cron runs daily and we check if tasks exist or use the 'next_generation_date' logic.

                const start = template.next_generation_date ? new Date(template.next_generation_date) : now
                const dates = rule.between(start, windowEnd, true)

                for (const date of dates) {
                    // Check if task already exists for this template and date (deduplication)
                    // This is expensive in a loop, better to batch or use a unique constraint/upsert.
                    // For this MVP, we'll trust the 'next_generation_date' logic or just insert.
                    // To be safe, let's just insert. The user requirement says "Insert specific rows".

                    tasksToInsert.push({
                        template_id: template.id,
                        user_id: template.user_id,
                        title: template.title,
                        due_date: date.toISOString(),
                        status: 'Pending',
                        is_generated: true
                    })
                }

                // Update template next_generation_date
                if (dates.length > 0) {
                    const lastDate = dates[dates.length - 1]
                    const nextRun = new Date(lastDate)
                    nextRun.setDate(nextRun.getDate() + 1) // Start next check after the last generated task

                    await supabase
                        .from('task_templates')
                        .update({ next_generation_date: nextRun.toISOString() })
                        .eq('id', template.id)
                }

            } catch (err) {
                console.error(`Error processing template ${template.id}:`, err)
            }
        }

        // 4. Batch Insert
        if (tasksToInsert.length > 0) {
            const { error: insertError } = await supabase
                .from('tasks')
                .insert(tasksToInsert)

            if (insertError) throw insertError
        }

        return new Response(
            JSON.stringify({ message: `Generated ${tasksToInsert.length} tasks` }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    } catch (error) {
        return new Response(
            JSON.stringify({ error: error.message }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    }
})
