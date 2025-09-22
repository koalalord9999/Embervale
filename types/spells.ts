import { SkillName } from './enums';

export type SpellElement = 'wind' | 'water' | 'earth' | 'fire';

export interface Spell {
    id: string;
    name: string;
    description: string;
    level: number;
    runes: { itemId: string, quantity: number }[];
    xp: number;
    type: 'combat' | 'utility-teleport' | 'utility-enchant' | 'utility-alchemy' | 'utility-processing' | 'curse' | 'enhancement';
    maxHit?: number;
    element?: SpellElement;
    targetItems?: string[]; // For enchant, alchemy, processing
    autocastable: boolean;
}
