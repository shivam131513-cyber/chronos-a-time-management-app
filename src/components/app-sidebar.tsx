'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, ShoppingBag, Trophy, Users, LogOut } from 'lucide-react'
import { motion } from 'framer-motion'

const NAV_ITEMS = [
    { name: 'Command Center', href: '/dashboard', icon: LayoutDashboard },
    { name: 'The Bazaar', href: '/marketplace', icon: ShoppingBag },
    { name: 'Hall of Legends', href: '/achievements', icon: Trophy },
    { name: 'Guild Hall', href: '/guilds', icon: Users },
]

export function AppSidebar() {
    const pathname = usePathname()

    return (
        <div className="w-64 h-screen fixed left-0 top-0 bg-black/40 backdrop-blur-xl border-r border-white/10 flex flex-col p-6 z-50">
            <div className="mb-10 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <span className="font-bold text-white">C</span>
                </div>
                <span className="text-xl font-bold text-white tracking-tight">Chronos</span>
            </div>

            <nav className="flex-1 space-y-2">
                {NAV_ITEMS.map((item) => {
                    const isActive = pathname === item.href
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`
                relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group
                ${isActive ? 'text-white' : 'text-white/40 hover:text-white hover:bg-white/5'}
              `}
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="activeNav"
                                    className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-white/10 rounded-xl"
                                    initial={false}
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                />
                            )}
                            <item.icon className={`w-5 h-5 relative z-10 ${isActive ? 'text-blue-400' : 'group-hover:text-blue-300'}`} />
                            <span className="relative z-10 font-medium">{item.name}</span>
                        </Link>
                    )
                })}
            </nav>

            <div className="pt-6 border-t border-white/10">
                <form action="/auth/signout" method="post">
                    <button className="flex items-center gap-3 px-4 py-3 text-white/40 hover:text-red-400 transition-colors w-full">
                        <LogOut className="w-5 h-5" />
                        <span className="font-medium">Disconnect</span>
                    </button>
                </form>
            </div>
        </div>
    )
}
