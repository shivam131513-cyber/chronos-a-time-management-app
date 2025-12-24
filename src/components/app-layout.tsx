import { AppSidebar } from "./app-sidebar"
import { DynamicBackground } from "./dynamic-background"
import { OracleQuote } from "./oracle-quote"
import { ZenToggle } from "./zen-toggle"
import { ZenWrapper } from "./zen-wrapper"
import { createClient } from '@/lib/supabase/server'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    // Fetch profile for streak and theme
    let streak = 0
    let theme = 'default'

    if (user) {
        const { data: profile } = await supabase
            .from('profiles')
            .select('current_streak, equipped_theme')
            .eq('id', user.id)
            .single()

        if (profile) {
            streak = profile.current_streak || 0
            theme = profile.equipped_theme || 'default'
        }
    }

    return (
        <div className="flex min-h-screen bg-black text-white font-sans selection:bg-blue-500/30">
            <DynamicBackground streak={streak} theme={theme} />

            <AppSidebar />

            <main className="flex-1 ml-64 relative z-10">
                {/* Top Bar */}
                <header className="h-16 border-b border-white/5 flex items-center justify-between px-8 bg-black/20 backdrop-blur-sm sticky top-0 z-50">
                    <OracleQuote />
                    <div className="flex items-center gap-4">
                        <ZenToggle />
                        {/* User Avatar or other controls could go here */}
                    </div>
                </header>

                <div className="p-8">
                    <ZenWrapper>
                        {children}
                    </ZenWrapper>
                </div>
            </main>
        </div>
    )
}
