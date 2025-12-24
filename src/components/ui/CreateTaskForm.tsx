'use client'

import { useState } from 'react'
import { createTask } from '@/app/actions/create-task'
import { Plus, Loader2, X } from 'lucide-react'
import { cn } from '@/lib/utils'

export function CreateTaskForm() {
    const [isOpen, setIsOpen] = useState(false)
    const [isPending, setIsPending] = useState(false)
    const [isRecurring, setIsRecurring] = useState(false)

    async function handleSubmit(formData: FormData) {
        setIsPending(true)

        // Construct RRule if recurring
        if (isRecurring) {
            const freq = formData.get('frequency')
            if (freq) {
                formData.set('rrule', `FREQ=${freq}`)
            }
        }

        const res = await createTask(formData)
        setIsPending(false)

        if (res?.success) {
            setIsOpen(false)
            setIsRecurring(false)
        } else {
            alert('Failed to create task: ' + (res?.error || 'Unknown error'))
        }
    }

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-8 right-8 w-14 h-14 bg-blue-600 hover:bg-blue-500 text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-blue-500/50 transition-all duration-300 z-50 group"
            >
                <Plus className="w-6 h-6 group-hover:rotate-90 transition-transform" />
            </button>
        )
    }

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl w-full max-w-md p-6 shadow-2xl relative animate-in fade-in zoom-in duration-200">
                <button
                    onClick={() => setIsOpen(false)}
                    className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <Plus className="w-5 h-5 text-blue-400" />
                    New Mission
                </h2>

                <form action={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs uppercase tracking-wider text-white/50 mb-1.5">Title</label>
                        <input
                            name="title"
                            type="text"
                            required
                            placeholder="e.g. Read 10 pages"
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-blue-500/50 transition-colors"
                        />
                    </div>

                    <div className="flex items-center gap-2 mb-2">
                        <input
                            type="checkbox"
                            id="isRecurring"
                            checked={isRecurring}
                            onChange={(e) => setIsRecurring(e.target.checked)}
                            className="w-4 h-4 rounded border-white/10 bg-white/5 text-blue-600 focus:ring-blue-500"
                        />
                        <label htmlFor="isRecurring" className="text-sm text-white/80 cursor-pointer select-none">
                            Make this a recurring mission
                        </label>
                    </div>

                    {!isRecurring ? (
                        <div className="animate-in slide-in-from-top-2 duration-200">
                            <label className="block text-xs uppercase tracking-wider text-white/50 mb-1.5">Due Date</label>
                            <input
                                name="due_date"
                                type="datetime-local"
                                required
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500/50 transition-colors [&::-webkit-calendar-picker-indicator]:invert"
                            />
                        </div>
                    ) : (
                        <div className="animate-in slide-in-from-top-2 duration-200">
                            <label className="block text-xs uppercase tracking-wider text-white/50 mb-1.5">Frequency</label>
                            <select
                                name="frequency"
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500/50 transition-colors appearance-none"
                            >
                                <option value="DAILY" className="bg-zinc-900">Daily</option>
                                <option value="WEEKLY" className="bg-zinc-900">Weekly</option>
                                <option value="MONTHLY" className="bg-zinc-900">Monthly</option>
                            </select>
                            <p className="text-[10px] text-white/30 mt-2">
                                * Advanced rules like "Every Friday" coming soon.
                            </p>
                        </div>
                    )}

                    <button
                        disabled={isPending}
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg mt-4 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isPending ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Creating...
                            </>
                        ) : (
                            'Initialize Mission'
                        )}
                    </button>
                </form>
            </div>
        </div>
    )
}
