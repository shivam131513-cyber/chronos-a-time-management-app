'use client'

import { TaskHistoryItem } from '@/app/actions/get-tasks-for-date'
import { X, CheckCircle2, Calendar } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface TaskHistoryModalProps {
    isOpen: boolean
    onClose: () => void
    date: string
    tasks: TaskHistoryItem[]
    isLoading: boolean
}

export function TaskHistoryModal({ isOpen, onClose, date, tasks, isLoading }: TaskHistoryModalProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    >
                        {/* Modal Content */}
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-[#0a0a0a] border border-white/10 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl"
                        >
                            {/* Header */}
                            <div className="p-6 border-b border-white/10 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                                        <Calendar className="w-5 h-5 text-blue-400" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-bold text-white">Activity Log</h2>
                                        <p className="text-sm text-white/40">{new Date(date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/40 hover:text-white"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Body */}
                            <div className="p-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
                                {isLoading ? (
                                    <div className="flex flex-col items-center justify-center py-8 text-white/40">
                                        <div className="w-6 h-6 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mb-2" />
                                        <span className="text-sm">Loading history...</span>
                                    </div>
                                ) : tasks.length > 0 ? (
                                    <div className="space-y-3">
                                        {tasks.map((task, index) => (
                                            <motion.div
                                                key={task.id}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: index * 0.05 }}
                                                className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/5"
                                            >
                                                <CheckCircle2 className="w-5 h-5 text-green-500" />
                                                <div className="flex-1">
                                                    <h3 className="text-sm font-medium text-white">{task.title}</h3>
                                                    <p className="text-xs text-white/40">
                                                        Completed at {new Date(task.completed_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </p>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8 text-white/40">
                                        <p>No tasks completed on this day.</p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}
