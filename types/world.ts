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

export type BonfireActivity = { type: 'bonfire', uniqueId: string, logId: string, expiresAt: number, poiId: string };

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
  | { type: 'npc'; name: string; icon: string; dialogue?: Record<string, DialogueNode>; startNode?: string; actions?: { label: string; action: 'open_bank' | 'deposit_backpack' | 'deposit_equipment' }[]; dialogueType?: 'random'; questCondition?: QuestCondition; attackableMonsterId?: string; pickpocket?: { lootTableId: string; }; }
  | { type: 'cooking_range' }
  | { type: 'furnace' }
  | { type: 'anvil' }
  | { type: 'bookbinding_workbench' }
  | { type: 'egg_collecting'; loot: { itemId: 'eggs'; chance: 1 } }
  | { type: 'wishing_well' }
  | { type: 'quest_board'; questCondition?: QuestCondition; }
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
  | { type: 'ladder'; name: string; direction: 'up' | 'down'; toPoiId: string; questCondition?: QuestCondition; }
  | { 
      type: 'thieving_lockpick';
      id: string; // Unique ID for state tracking
      targetName: string; // e.g., 'Locked Door', 'Ornate Chest'
      lootTableId: string;
    }
  | {
      type: 'thieving_stall';
      id: string; // Unique ID for state tracking
      name: string; // e.g., 'Steal from Bakery Stall'
      lootTableId: string;
    }
  | {
      type: 'thieving_pilfer';
      id: string; // Unique ID for this door, e.g., "meadowdale_house_1"
      name: string; // e.g., "Locked House"
    }
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

export interface ThievingContainerState {
    depleted: boolean;
    respawnTimer: number; // in ms
}

export interface GroundItem {
  item: InventorySlot;
  expiresAt?: number;
  uniqueId: number;
  isDeathPile?: boolean;
}

export interface MapFeature {
  id: string;
  type: 'river' | 'mountain_range';
  path: string; // SVG path data "d" attribute
  strokeColor: string;
  strokeWidth: number;
}

export interface ActivePilferingSession {
    housePoiId: string;
    entryPoiId: string;
    startTime: number;
    tierId: string;
    tierLevel: number;
    lootedContainerIds?: string[];
}

export interface WorldState {
    windmillFlour: number;
    deathMarker?: {
        poiId: string;
        timeRemaining: number; // in ms
        immunityGranted?: boolean;
    } | null;
    poiImmunity?: Record<string, number>; // key: poiId, value: expiry timestamp
    bankPlaceholders?: boolean;
    hpBoost?: {
        amount: number;
        expiresAt: number;
    } | null;
    pendingQuestCombatReward?: InventorySlot | null;
    recentlyKilled?: string[]; // Array of unique monster instance IDs that were just killed
    activePilferingSession?: ActivePilferingSession | null;
    generatedHouses?: Record<string, { tierId: string, level: number, activities: POIActivity[] }>; // Maps door ID to a generated house tier with pre-generated activities
    depletedHouses?: string[];
    nextHouseResetTimestamp?: number;
}