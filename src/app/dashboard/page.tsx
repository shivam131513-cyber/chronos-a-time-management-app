import { createClient } from '@/lib/supabase/server'
import { BentoGrid, BentoGridItem } from '@/components/ui/BentoGrid'
import { TaskCard } from '@/components/ui/TaskCard'
import { CreateTaskForm } from '@/components/ui/CreateTaskForm'
import { redirect } from 'next/navigation'
import { Flame, Trophy, Zap } from 'lucide-react'
import { getActivityHistory } from '@/app/actions/get-activity-history'
import { getTemplates } from '@/app/actions/get-templates'
import { StreakHeatmap } from '@/components/streak-heatmap'
import { TemplateList } from '@/components/template-list'
import { CompleteTaskButton } from '@/components/complete-task-button'
import AppLayout from '@/components/app-layout'
import { ZenWrapper } from '@/components/zen-wrapper'

export default async function DashboardPage() {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        redirect('/login')
    }

    // Parallel Data Fetching
    const [
        { data: tasks },
        { data: profile },
        activityHistory,
        templates
    ] = await Promise.all([
        supabase
            .from('tasks')
            .select('*')
            .eq('user_id', user?.id || '')
            .eq('status', 'Pending')
            .order('due_date', { ascending: true }),
        supabase
            .from('profiles')
            .select('*')
            .eq('id', user?.id || '')
            .single(),
        getActivityHistory(30),
        getTemplates()
    ])

    // Calculate stats
    const pendingTasks = tasks || []
    const northStar = pendingTasks[0] // Simple "North Star" logic: first due task
    const quickWins = pendingTasks.filter(t => !t.is_generated).slice(0, 3) // Mock logic for quick wins

    return (
        <AppLayout>
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-purple-200 mb-2">
                    Welcome back, {user?.email?.split('@')[0] || 'Traveler'}
                </h1>
                <p className="text-white/60">Your journey continues.</p>
            </div>

            <BentoGrid>
                {/* North Star (Top Priority) */}
                <BentoGridItem colSpan={2} rowSpan={2} className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-blue-500/20 relative z-10">
                    <div className="h-full flex flex-col justify-between p-2">
                        <div className="flex items-center gap-2 text-blue-300 mb-4">
                            <Zap className="w-5 h-5 fill-current" />
                            <span className="uppercase tracking-wider text-xs font-bold">North Star</span>
                        </div>

                        {northStar ? (
                            <div className="flex-1 flex flex-col justify-center">
                                <h2 className="text-3xl font-bold text-white mb-4">{northStar.title}</h2>
                                <div className="text-white/60 text-sm mb-8">
                                    Due {new Date(northStar.due_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                                <CompleteTaskButton taskId={northStar.id} />
                            </div>
                        ) : (
                            <div className="flex-1 flex items-center justify-center text-white/40">
                                No active missions
                            </div>
                        )}
                    </div>
                </BentoGridItem>

                {/* Stats: Streak & Activity Heatmap */}
                <BentoGridItem colSpan={2} className="bg-gradient-to-br from-green-500/5 to-emerald-500/5 border-green-500/20 zen-blur">
                    <StreakHeatmap
                        activityData={activityHistory}
                        totalXP={profile?.total_xp || 0}
                    />
                </BentoGridItem>

                {/* Stats: XP (Small) */}
                <BentoGridItem className="bg-purple-500/5 border-purple-500/20 zen-blur">
                    <div className="h-full flex flex-col items-center justify-center text-center">
                        <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center mb-3">
                            <Trophy className="w-6 h-6 text-purple-400" />
                        </div>
                        <div className="text-3xl font-bold text-white mb-1">{profile?.total_xp || 0}</div>
                        <div className="text-xs text-purple-300 uppercase tracking-wide">Total XP</div>
                    </div>
                </BentoGridItem>

                {/* Quick Wins List */}
                <BentoGridItem colSpan={1} rowSpan={2} className="overflow-y-auto zen-blur">
                    <div className="flex items-center gap-2 text-green-300 mb-4">
                        <span className="uppercase tracking-wider text-xs font-bold">Quick Wins</span>
                    </div>
                    <div className="space-y-2">
                        {quickWins.map(task => (
                            <div key={task.id} className="p-3 rounded-lg bg-white/5 border border-white/10 text-sm text-white/80">
                                {task.title}
                            </div>
                        ))}
                        {quickWins.length === 0 && (
                            <div className="text-white/40 text-sm text-center py-4">No quick tasks</div>
                        )}
                    </div>
                </BentoGridItem>

                {/* Active Templates List */}
                <BentoGridItem colSpan={2} className="min-h-[200px] bg-purple-500/5 border-purple-500/10 zen-blur">
                    <TemplateList templates={templates} />
                </BentoGridItem>
            </BentoGrid>

            <CreateTaskForm />
        </AppLayout>
    )
}
