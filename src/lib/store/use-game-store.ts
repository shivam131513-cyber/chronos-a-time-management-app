import { create } from 'zustand'

interface GameState {
    isZenMode: boolean
    toggleZenMode: () => void
}

export const useGameStore = create<GameState>((set) => ({
    isZenMode: false,
    toggleZenMode: () => set((state) => ({ isZenMode: !state.isZenMode })),
}))
