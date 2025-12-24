import { createClient } from '@/lib/supabase/server'
import AppLayout from '@/components/app-layout'
import { getMarketplaceItems } from '@/app/actions/marketplace'
import { ItemCard } from '@/components/item-card'
import { Coins, ShoppingBag } from 'lucide-react'
import { redirect } from 'next/navigation'

export default async function MarketplacePage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) redirect('/login')

    const [items, { data: profile }, { data: inventory }] = await Promise.all([
        getMarketplaceItems(),
        supabase.from('profiles').select('*').eq('id', user.id).single(),
        supabase.from('inventory').select('*').eq('user_id', user.id)
    ])

    return (
        <AppLayout>
            <div className="mb-8 flex items-end justify-between">
                <div>
                    <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-orange-200 mb-2">
                        The Bazaar
                    </h1>
                    <p className="text-white/60">Trade your time for treasures.</p>
                </div>

                <div className="flex items-center gap-2 px-4 py-2 bg-yellow-500/10 border border-yellow-500/20 rounded-full text-yellow-400">
                    <Coins className="w-5 h-5" />
                    <span className="font-bold text-lg">{profile?.currency || 0}</span>
                </div>
            </div>

            {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-white/40">
                    <ShoppingBag className="w-16 h-16 mb-4 opacity-20" />
                    <p>The shelves are empty today.</p>
                    <p className="text-sm mt-2">Check back later for new stock.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {items.map(item => {
                        const ownedItem = inventory?.find(i => i.item_id === item.id)
                        return (
                            <ItemCard
                                key={item.id}
                                item={item}
                                userCurrency={profile?.currency || 0}
                                ownedQuantity={ownedItem?.quantity || 0}
                            />
                        )
                    })}
                </div>
            )}
        </AppLayout>
    )
}
