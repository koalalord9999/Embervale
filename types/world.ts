import { SkillName } from './enums';
import { DialogueNode } from './quests';

export interface SkillRequirement {
    skill: SkillName;
    level: number;
    xp: number;
    description: string;
    actionText: string;
    items?: { itemId: string; quantity: number }[];
}

export interface Region {
  id: string;
  name: string;
  type: 'city' | 'region' | 'dungeon';
  entryPoiId: string;
  x: number; // World map x
  y: number; // World map y
}

export type POIActivity =
  | { type: 'skilling'; id: string; name?: string; skill: SkillName; requiredLevel: number; loot: { itemId: string; chance: number; xp: number; requiredLevel?: number }[]; resourceCount: { min: number, max: number }; respawnTime: number; gatherTime: number; }
  | { type: 'combat'; monsterId: string }
  | { type: 'shop'; shopId: string }
  | { type: 'quest_start'; questId: string }
  | { type: 'npc'; name: string; icon: string; dialogue: string[] }
  | { type: 'cooking_range' }
  | { type: 'furnace' }
  | { type: 'anvil' }
  | { type: 'shearing'; loot: { itemId: 'wool'; chance: 1 } }
  | { type: 'egg_collecting'; loot: { itemId: 'eggs'; chance: 1 } }
  | { type: 'wishing_well' }
  | { type: 'quest_board' }
  | { type: 'bank' }
  | { type: 'spinning_wheel' }
  | { type: 'blimp_travel'; requiredSlayerLevel: number; }
  | { type: 'slayer_master'; name: string; icon: string; }
  | { type: 'interactive_dialogue'; dialogue: Record<string, DialogueNode>; startNode: string; };

export interface POI {
  id: string;
  name: string;
  description: string;
  connections: string[];
  activities: POIActivity[];
  unlockRequirement?: { type: 'quest'; questId: string; stage: number }
  connectionRequirements?: Record<string, SkillRequirement>; // Key is the destination POI id
  regionId: string;
  x: number; // Percentage from left
  y: number; // Percentage from top
  type?: 'internal';
  cityMapX?: number; // X coordinate for display on a city map, if this is an exit
  cityMapY?: number; // Y coordinate for display on a city map, if this is an exit
}

export interface ResourceNodeState {
    resources: number;
    respawnTimer: number; // in ms
}
