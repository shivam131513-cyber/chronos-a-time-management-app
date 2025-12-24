import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface BentoGridProps {
    children: ReactNode;
    className?: string;
}

export const BentoGrid = ({ children, className }: BentoGridProps) => {
    return (
        <div
            className={cn(
                "grid grid-cols-1 md:grid-cols-3 gap-4 max-w-7xl mx-auto auto-rows-[minmax(180px,auto)]",
                className
            )}
        >
            {children}
        </div>
    );
};

interface BentoGridItemProps {
    children: ReactNode;
    className?: string;
    colSpan?: number;
    rowSpan?: number;
}

export const BentoGridItem = ({
    children,
    className,
    colSpan = 1,
    rowSpan = 1,
}: BentoGridItemProps) => {
    return (
        <div
            className={cn(
                "glass rounded-xl p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl relative overflow-hidden group",
                colSpan === 2 && "md:col-span-2",
                colSpan === 3 && "md:col-span-3",
                rowSpan === 2 && "md:row-span-2",
                className
            )}
        >
            {/* Spotlight Effect */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-[radial-gradient(600px_at_var(--mouse-x,50%)_var(--mouse-y,50%),rgba(255,255,255,0.06),transparent)]" />

            <div className="relative z-10 h-full">
                {children}
            </div>
        </div>
    );
};
