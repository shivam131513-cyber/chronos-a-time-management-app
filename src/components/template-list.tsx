'use client'

import { TaskTemplate } from '@/app/actions/get-templates'
import { Repeat, CalendarClock } from 'lucide-react'

interface TemplateListProps {
    templates: TaskTemplate[]
}

export function TemplateList({ templates }: TemplateListProps) {
    return (
        <div className="h-full flex flex-col">
            <div className="flex items-center gap-2 text-purple-300 mb-4 px-2 pt-2">
                <Repeat className="w-5 h-5" />
                <span className="uppercase tracking-wider text-xs font-bold">Active Rituals</span>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                {templates.length > 0 ? (
                    templates.map(template => (
                        <div
                            key={template.id}
                            className="group p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all cursor-default"
                        >
                            <div className="flex items-start justify-between mb-1">
                                <h3 className="text-sm font-medium text-white group-hover:text-purple-200 transition-colors">
                                    {template.title}
                                </h3>
                                <CalendarClock className="w-3 h-3 text-white/40" />
                            </div>
                            <div className="text-xs text-white/40 font-mono truncate">
                                {template.rrule}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center text-white/40 p-4">
                        <Repeat className="w-8 h-8 mb-2 opacity-50" />
                        <p className="text-sm">No recurring rituals yet.</p>
                        <p className="text-xs mt-1">Create a task with a schedule to see it here.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
