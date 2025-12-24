'use client'

import { motion } from "framer-motion";
import { Check, Clock, Flame } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface TaskCardProps {
    task: {
        id: string;
        title: string;
        due_date: string;
        status: 'Pending' | 'Completed';
        priority?: 'Low' | 'Medium' | 'High' | 'Critical';
    };
    onComplete: (id: string) => void;
}

export const TaskCard = ({ task, onComplete }: TaskCardProps) => {
    const [isCompleting, setIsCompleting] = useState(false);

    const handleComplete = () => {
        setIsCompleting(true);
        // Trigger confetti here if needed
        setTimeout(() => {
            onComplete(task.id);
        }, 500); // Wait for animation
    };

    if (task.status === 'Completed') return null;

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{
                opacity: isCompleting ? 0 : 1,
                scale: isCompleting ? 0.8 : 1,
                y: isCompleting ? 20 : 0
            }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="glass glass-hover rounded-lg p-4 mb-3 flex items-center justify-between group cursor-pointer"
        >
            <div className="flex items-center gap-3">
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        handleComplete();
                    }}
                    className={cn(
                        "w-6 h-6 rounded-full border-2 border-white/30 flex items-center justify-center transition-all duration-300",
                        "hover:border-green-400 hover:bg-green-400/20 group-hover:scale-110"
                    )}
                >
                    <Check className="w-3 h-3 text-transparent group-hover:text-green-400 transition-colors" />
                </button>

                <div>
                    <h3 className="text-white font-medium group-hover:text-blue-200 transition-colors">
                        {task.title}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-white/50">
                        <Clock className="w-3 h-3" />
                        <span>{new Date(task.due_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                </div>
            </div>

            {task.priority === 'Critical' && (
                <div className="bg-red-500/20 text-red-300 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                    <Flame className="w-3 h-3 fill-current animate-pulse" />
                    <span>Critical</span>
                </div>
            )}
        </motion.div>
    );
};
