'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export type MarketplaceItem = {
    id: string
    name: string
    description: string
    cost: number
    type: 'Consumable' | 'Cosmetic' | 'RealWorld'
    image_url: string | null
}

export async function getMarketplaceItems() {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('items')
        .select('*')
        .order('cost', { ascending: true })

    if (error) {
        console.error('Error fetching items:', error)
        return []
    }

    return data as MarketplaceItem[]
}

export async function buyItem(itemId: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { success: false, message: 'Not authenticated' }

    // 1. Get User Profile (for currency)
    const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('currency')
        .eq('id', user.id)
        .single()

    if (profileError || !profile) return { success: false, message: 'Profile not found' }

    // 2. Get Item (for cost)
    const { data: item, error: itemError } = await supabase
        .from('items')
        .select('*')
        .eq('id', itemId)
        .single()

    if (itemError || !item) return { success: false, message: 'Item not found' }

    // 3. Check Funds
    if (profile.currency < item.cost) {
        return { success: false, message: 'Insufficient funds' }
    }

    // 4. Transaction (Deduct Funds + Add to Inventory)
    // Note: Ideally this should be a stored procedure or transaction, but we'll do it in steps for now.

    // Deduct Funds
    const { error: deductError } = await supabase
        .from('profiles')
        .update({ currency: profile.currency - item.cost })
        .eq('id', user.id)

    if (deductError) return { success: false, message: 'Transaction failed' }

    // Add to Inventory
    // Check if already owns (if we want stacking)
    const { data: existingItem } = await supabase
        .from('inventory')
        .select('*')
        .eq('user_id', user.id)
        .eq('item_id', itemId)
        .single()

    if (existingItem) {
        await supabase
            .from('inventory')
            .update({ quantity: existingItem.quantity + 1 })
            .eq('id', existingItem.id)
    } else {
        await supabase
            .from('inventory')
            .insert({ user_id: user.id, item_id: itemId, quantity: 1 })
    }

    revalidatePath('/marketplace')
    revalidatePath('/dashboard') // Update currency display if we add it there
    return { success: true, message: `Purchased ${item.name}!` }
}
