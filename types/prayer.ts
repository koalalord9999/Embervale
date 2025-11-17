import { SkillName } from './enums';
import { QuestId } from './quests';

export enum PrayerType {
    STAT_BOOST,
    PROTECTION,
    HEALTH,
}

export interface Prayer {
    id: string;
    name: string;
    description: string;
    level: number;
    drainRate: number; // points per minute
    iconUrl: string;
    type: PrayerType;
    group?: string; // Used to group mutually exclusive prayers
    boost?: {
        skill: 'Attack' | 'Strength' | 'Defence' | 'Ranged' | 'Magic';
        percent: number;
    };
    protection?: 'item' | 'melee' | 'ranged' | 'magic';
    questId?: QuestId; // For quest-locked prayers
}