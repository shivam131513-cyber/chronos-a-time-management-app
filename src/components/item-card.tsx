'use client'

import { useState } from 'react'
import { MarketplaceItem, buyItem } from '@/app/actions/marketplace'
import { useItem } from '@/app/actions/use-item'
import { motion } from 'framer-motion'
import { Coins, Loader2, ShoppingBag, Play } from 'lucide-react'

export function ItemCard({ item, userCurrency, ownedQuantity = 0 }: { item: MarketplaceItem, userCurrency: number, ownedQuantity?: number }) {
    const [isLoading, setIsLoading] = useState(false)
    const canAfford = userCurrency >= item.cost
    const isOwned = ownedQuantity > 0

    const handleBuy = async () => {
        if (!canAfford) return
        setIsLoading(true)
        try {
            const result = await buyItem(item.id)
            if (result.success) {
                alert(result.message)
            } else {
                alert(result.message)
            }
        } catch (error) {
            console.error(error)
            alert('Something went wrong')
        } finally {
            setIsLoading(false)
        }
    }

    const handleUse = async () => {
        setIsLoading(true)
        try {
            const result = await useItem(item.id)
            if (result.success) {
                alert(result.message)
            } else {
                alert(result.message)
            }
        } catch (error) {
            console.error(error)
            alert('Something went wrong')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="group relative bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:border-white/20 transition-all"
        >
            {/* Image Placeholder */}
            <div className="h-32 bg-gradient-to-br from-blue-500/10 to-purple-500/10 flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
                {item.image_url ? (
                    <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                ) : (
                    <ShoppingBag className="w-12 h-12 text-white/20" />
                )}
            </div>

            <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-white">{item.name}</h3>
                    <div className="flex items-center gap-1 text-yellow-400 text-sm font-medium">
                        <Coins className="w-3 h-3" />
                        {item.cost}
                    </div>
                </div>
                <p className="text-xs text-white/50 mb-4 h-8 line-clamp-2">{item.description}</p>

                <div className="flex gap-2">
                    <button
                        onClick={handleBuy}
                        disabled={!canAfford || isLoading}
                        className={`
                            flex-1 py-2 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all
                            ${canAfford
                                ? 'bg-white text-black hover:bg-blue-50'
                                : 'bg-white/5 text-white/20 cursor-not-allowed'}
                        `}
                    >
                        {isLoading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <>Purchase</>
                        )}
                    </button>

                    {isOwned && (
                        <button
                            onClick={handleUse}
                            disabled={isLoading}
                            className="px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg flex items-center justify-center transition-colors"
                            title={item.type === 'Cosmetic' ? 'Equip' : 'Use'}
                        >
                            <Play className="w-4 h-4" />
                        </button>
                    )}
                </div>
                {isOwned && (
                    <div className="mt-2 text-center text-[10px] text-white/40 uppercase font-bold">
                        Owned: {ownedQuantity}
                    </div>
                )}
            </div>
        </motion.div>
    )
}
