'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function useItem(itemId: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { success: false, message: 'Not authenticated' }

    // 1. Get Item Details
    const { data: item } = await supabase
        .from('items')
        .select('*')
        .eq('id', itemId)
        .single()

    if (!item) return { success: false, message: 'Item not found' }

    // 2. Check Inventory
    const { data: inventoryItem } = await supabase
        .from('inventory')
        .select('*')
        .eq('user_id', user.id)
        .eq('item_id', itemId)
        .single()

    if (!inventoryItem || inventoryItem.quantity < 1) {
        return { success: false, message: 'You do not own this item' }
    }

    // 3. Apply Effect
    let message = ''

    if (item.type === 'Cosmetic') {
        // Equip Theme
        // We assume item.name maps to a theme key or we store a key in item metadata.
        // For MVP, let's map names to keys manually or assume name is the key.
        let themeKey = 'default'
        if (item.name.includes('Cyberpunk')) themeKey = 'cyberpunk'
        if (item.name.includes('Zen')) themeKey = 'zen'

        await supabase
            .from('profiles')
            .update({ equipped_theme: themeKey })
            .eq('id', user.id)

        message = `Equipped ${item.name}!`
    } else if (item.type === 'Consumable') {
        if (item.name.includes('Double XP')) {
            // Set double_xp_until to 1 hour from now
            const expiry = new Date(Date.now() + 60 * 60 * 1000).toISOString()

            // We need to merge with existing effects
            const { data: profile } = await supabase.from('profiles').select('active_effects').eq('id', user.id).single()
            const currentEffects = profile?.active_effects || {}

            await supabase
                .from('profiles')
                .update({
                    active_effects: { ...currentEffects, double_xp_until: expiry }
                })
                .eq('id', user.id)

            // Consume Item
            if (inventoryItem.quantity > 1) {
                await supabase.from('inventory').update({ quantity: inventoryItem.quantity - 1 }).eq('id', inventoryItem.id)
            } else {
                await supabase.from('inventory').delete().eq('id', inventoryItem.id)
            }

            message = 'Double XP activated for 1 hour!'
        } else {
            return { success: false, message: 'Item effect not implemented yet' }
        }
    } else {
        return { success: false, message: 'Cannot use this item type' }
    }

    revalidatePath('/dashboard')
    revalidatePath('/marketplace')
    return { success: true, message }
}
