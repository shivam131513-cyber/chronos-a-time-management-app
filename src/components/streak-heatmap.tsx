'use client'

import { ActivityDay } from '@/app/actions/get-activity-history'
import { motion } from 'framer-motion'
import { Trophy } from 'lucide-react'
import { useState } from 'react'
import { TaskHistoryModal } from './task-history-modal'
import { getTasksForDate, TaskHistoryItem } from '@/app/actions/get-tasks-for-date'

interface StreakHeatmapProps {
    activityData: ActivityDay[]
    totalXP: number
    dailyTarget?: number // Default to 3 tasks per day for score calculation
}

export function StreakHeatmap({ activityData, totalXP, dailyTarget = 3 }: StreakHeatmapProps) {
    const [selectedDate, setSelectedDate] = useState<string | null>(null)
    const [modalOpen, setModalOpen] = useState(false)
    const [tasks, setTasks] = useState<TaskHistoryItem[]>([])
    const [isLoading, setIsLoading] = useState(false)

    // Get current date info
    const now = new Date()
    const currentYear = now.getFullYear()
    const currentMonth = now.getMonth()
    const todayStr = now.toISOString().split('T')[0]

    // Format for display (using explicit format to avoid hydration errors)
    const monthName = now.toLocaleString('en-US', { month: 'long' })
    const dayName = now.toLocaleString('en-US', { weekday: 'long' })
    const fullDate = `${monthName} ${now.getDate()}, ${currentYear}`

    // Generate days for the current month
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
    const days = Array.from({ length: daysInMonth }, (_, i) => {
        const d = new Date(currentYear, currentMonth, i + 1)
        // Adjust for timezone offset to ensure correct YYYY-MM-DD
        const offset = d.getTimezoneOffset()
        const adjustedDate = new Date(d.getTime() - (offset * 60 * 1000))
        return adjustedDate.toISOString().split('T')[0]
    })

    // Map activity to days
    const activityMap = new Map(activityData.map(d => [d.date, d.count]))

    // Calculate today's score
    const todayCount = activityMap.get(todayStr) || 0
    const scorePercentage = Math.min((todayCount / dailyTarget) * 100, 100)

    const getIntensityColor = (count: number) => {
        if (count === 0) return 'bg-white/5 text-white/20'
        if (count <= 1) return 'bg-green-500/20 text-green-200'
        if (count <= 3) return 'bg-green-500/50 text-white'
        return 'bg-green-500 text-white'
    }

    const handleDayClick = async (date: string) => {
        setSelectedDate(date)
        setModalOpen(true)
        setIsLoading(true)
        try {
            const data = await getTasksForDate(date)
            setTasks(data)
        } catch (error) {
            console.error('Failed to load tasks', error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <>
            <div className="h-full flex flex-col p-4">
                {/* Header with Date & Month */}
                <div className="flex items-start justify-between mb-6">
                    <div>
                        <div className="flex items-center gap-2 text-green-300 mb-1">
                            <Trophy className="w-5 h-5" />
                            <span className="uppercase tracking-wider text-xs font-bold">Daily Performance</span>
                        </div>
                        <h3 className="text-xl font-bold text-white">{monthName} {currentYear}</h3>
                    </div>
                    <div className="text-right">
                        <div className="text-sm font-medium text-blue-200">{dayName}</div>
                        <div className="text-xs text-white/40">{fullDate}</div>
                    </div>
                </div>

                <div className="flex-1 flex flex-col gap-6">
                    {/* Calendar Grid */}
                    <div className="grid grid-cols-7 gap-2">
                        {/* Weekday Headers */}
                        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                            <div key={i} className="text-center text-[10px] text-white/30 font-bold uppercase">
                                {d}
                            </div>
                        ))}

                        {/* Empty slots for start of month alignment (optional, but good for calendar feel) */}
                        {Array.from({ length: new Date(currentYear, currentMonth, 1).getDay() }).map((_, i) => (
                            <div key={`empty-${i}`} />
                        ))}

                        {days.map(date => {
                            const count = activityMap.get(date) || 0
                            const dayNumber = new Date(date).getDate()
                            const isToday = date === todayStr

                            return (
                                <motion.button
                                    key={date}
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: Math.random() * 0.5 }}
                                    onClick={() => handleDayClick(date)}
                                    className={`
                                        aspect-square rounded-sm relative group flex items-center justify-center text-[10px] font-medium transition-all cursor-pointer
                                        ${getIntensityColor(count)}
                                        ${isToday ? 'ring-2 ring-blue-400 ring-offset-2 ring-offset-black' : 'hover:ring-1 ring-white/20'}
                                    `}
                                >
                                    {dayNumber}
                                </motion.button>
                            )
                        })}
                    </div>

                    {/* Daily Score Comparison */}
                    <div className="bg-white/5 rounded-xl p-4 flex items-center gap-4 border border-white/10 mt-auto">
                        <div className="relative w-16 h-16 flex items-center justify-center">
                            {/* Circular Progress Background */}
                            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                                <path
                                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                    fill="none"
                                    stroke="#ffffff10"
                                    strokeWidth="4"
                                />
                                <path
                                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                    fill="none"
                                    stroke={scorePercentage >= 100 ? '#22c55e' : '#eab308'}
                                    strokeWidth="4"
                                    strokeDasharray={`${scorePercentage}, 100`}
                                    className="transition-all duration-1000 ease-out"
                                />
                            </svg>
                            <div className="absolute text-xs font-bold text-white">{Math.round(scorePercentage)}%</div>
                        </div>

                        <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                                <span className="text-sm font-medium text-white">Today's Focus</span>
                                <span className="text-xs text-white/60">{todayCount} / {dailyTarget} Tasks</span>
                            </div>
                            <div className="text-xs text-white/40">
                                {scorePercentage >= 100
                                    ? "🔥 You're on fire! Daily target crushed."
                                    : "Keep going! You're almost there."}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <TaskHistoryModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                date={selectedDate || ''}
                tasks={tasks}
                isLoading={isLoading}
            />
        </>
    )
}
