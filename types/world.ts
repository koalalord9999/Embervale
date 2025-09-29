import { SkillName, InventorySlot, ToolType } from './';
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
  type: 'city' | 'region' | 'dungeon' | 'underground';
  entryPoiId: string;
  x: number; // World map x
  y: number; // World map y
  description?: string;
  recommendedCombatLevel?: number;
}

export type BonfireActivity = { type: 'bonfire', uniqueId: string, logId: string, expiresAt: number };

// Defines the structure for quest-based activity visibility.
// - questId: The ID of the quest to check.
// - stages: An array of quest stages during which this activity is visible.
// - visibleAfterCompletion: If true, the activity becomes visible again after the quest is complete.
export interface QuestCondition {
    questId: string;
    stages: number[];
    visibleAfterCompletion?: boolean;
}

export type POIActivity =
  | { type: 'skilling'; id: string; name?: string; skill: SkillName; requiredLevel: number; loot: { itemId: string; chance: number; xp: number; requiredLevel?: number }[]; resourceCount: { min: number, max: number }; respawnTime: number; gatherTime: number; harvestBoost?: number; requiredTool?: ToolType; treeHardness?: number; questCondition?: QuestCondition; }
  | { type: 'combat'; monsterId: string }
  | { type: 'shop'; shopId: string }
  | { type: 'npc'; name: string; icon: string; dialogue: Record<string, DialogueNode>; startNode: string; actions?: any[]; dialogueType?: 'random'; questCondition?: QuestCondition; }
  | { type: 'cooking_range' }
  | { type: 'furnace' }
  | { type: 'anvil' }
  | { type: 'bookbinding_workbench' }
  | { type: 'shearing'; loot: { itemId: 'wool'; chance: 1 } }
  | { type: 'egg_collecting'; loot: { itemId: 'eggs'; chance: 1 } }
  | { type: 'wishing_well' }
  | { type: 'quest_board' }
  | { type: 'bank' }
  | { type: 'spinning_wheel' }
  | { type: 'blimp_travel'; requiredSlayerLevel: number; }
  | { type: 'slayer_master'; name: string; icon: string; }
  | { type: 'water_source', name: string }
  | { type: 'milking' }
  | { type: 'windmill' }
  | { type: 'runecrafting_altar'; runeId: string; questCondition?: QuestCondition; }
  | { type: 'ancient_chest'; name: string; }
  | { type: 'quest_start'; questId: string }
  | BonfireActivity;

export interface POI {
  id: string;
  name: string;
  description: string;
  connections: string[];
  activities: POIActivity[];
  unlockRequirement?: { type: 'quest'; questId: string; stage: number }
  connectionRequirements?: Record<string, SkillRequirement>; // Key is the destination POI id
  regionId: string;
  x: number; // Coordinate for its own map (world or internal)
  y: number; // Coordinate for its own map (world or internal)
  type?: 'internal';
  cityMapX?: number; // X coordinate for display on a city map, if this is an exit
  cityMapY?: number; // Y coordinate for display on a city map, if this is an exit
  internalX?: number; // Optional separate coordinate for internal navigation if it differs
  internalY?: number; // Optional separate coordinate for internal navigation if it differs
}

export interface ResourceNodeState {
    resources: number;
    respawnTimer: number; // in ms
}

export interface GroundItem {
  item: InventorySlot;
  dropTime: number;
  uniqueId: number;
}

export interface MapFeature {
  id: string;
  type: 'river' | 'mountain_range';
  path: string; // SVG path data "d" attribute
  strokeColor: string;
  strokeWidth: number;
}