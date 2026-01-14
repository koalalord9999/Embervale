import { ReactNode } from 'react';

export type ActivePanel = 'inventory' | 'skills' | 'quests' | 'equipment' | 'crafting' | 'map' | 'bank' | 'dev' | 'combat' | 'settings' | 'spellbook' | 'prayer' | 'sound' | null;

// Move tutorial related types from useUIState hook to central types
export interface GuidedTutorialStep {
    targetId: string;
    description: ReactNode;
}

export interface ActiveTutorialState {
    id: string;
    steps: GuidedTutorialStep[];
    currentStepIndex: number;
}