import { SkillName } from './enums';
import { InventorySlot } from './entities';

export interface PlayerQuestState {
  questId: string;
  currentStage: number;
  progress: number;
  isComplete: boolean;
}

export interface PlayerSlayerTask {
    monsterId: string;
    requiredCount: number;
    progress: number;
    isComplete: boolean;
}

export type QuestRequirement =
  | ({ type: 'gather' } & ({ itemId: string; quantity: number } | { items: { itemId: string; quantity: number }[] }))
  | { type: 'kill'; monsterId: string; quantity: number; style?: 'melee' | 'ranged' | 'magic' }
  | { type: 'talk'; poiId: string; npcName: string }
  | { type: 'shear'; quantity: number }
  | { type: 'smith'; itemId: string; quantity: number }
  | { type: 'spin'; quantity: number }
  | { type: 'accept_repeatable_quest'; questId: string };

export type DialogueAction =
  | { type: 'give_item'; itemId: string; quantity: number; noted?: boolean }
  | { type: 'take_item'; itemId: string; quantity: number }
  | { type: 'give_coins'; amount: number }
  | { type: 'take_coins'; amount: number }
  | { type: 'give_xp'; skill: SkillName; amount: number }
  | { type: 'start_quest'; questId: string }
  | { type: 'advance_quest'; questId: string }
  | { type: 'complete_quest'; questId: string }
  | { type: 'teleport'; poiId: string }
  | { type: 'heal'; amount: 'full' | number }
  | { type: 'restore_stats' }
  | { type: 'complete_tutorial' };

export type DialogueCheckRequirement = 
    | { type: 'items'; items: { itemId: string, quantity: number, operator?: 'gte' | 'lt' | 'eq' }[] }
    | { type: 'coins'; amount: number }
    | { type: 'skill'; skill: SkillName; level: number }
    | { type: 'world_state'; property: 'windmillFlour'; value: number; operator?: 'gte' | 'eq' };

export interface DialogueCheck {
    requirements: DialogueCheckRequirement[];
    successNode: string;
    failureNode: string;
}

export interface DialogueResponse {
    text: string;
    next?: string;
    check?: DialogueCheck;
    actions?: DialogueAction[];
}

export interface DialogueNode {
    npcName: string;
    npcIcon: string;
    text: string;
    responses: DialogueResponse[];
    conditionalResponses?: DialogueResponse[];
    highlight?: string | string[];
}

// @fix: Defined the missing 'QuestStage' interface.
export interface QuestStage {
  description: string;
  requirement: QuestRequirement;
  stageRewards?: {
    xp?: { skill: SkillName; amount: number }[];
    items?: InventorySlot[];
    coins?: number;
  };
}

export interface Quest {
  id:string;
  name: string;
  description: string;
  stages: QuestStage[];
  rewards: { xp?: { skill: SkillName; amount: number }[]; items?: InventorySlot[]; coins?: number };
  isHidden?: boolean;
  dialogue?: Record<string, DialogueNode>; // This is now primarily for reference and will be stored in POI data
  startDialogueNode?: string; // This is now primarily for reference and will be stored in POI data
  startHint: string;
  playerStagePerspectives: string[];
  completionSummary: string;
  startPoi?: string;
}

export interface RepeatableQuest {
    id: string;
    type: 'gather' | 'interact' | 'kill';
    title: string;
    description: string;
    location: 'meadowdale' | 'oakhaven' | 'general';
    locationPoiId?: string; // For 'interact' type
    target: {
        itemId?: string; // For 'gather' type
        name?: string; // For 'interact' type
        monsterId?: string; // For 'kill' type
    };
    baseCoinReward: number; // Per item for 'gather', or flat for 'interact'
    xpReward: {
        skill: SkillName;
        amount: number;
    };
}

export interface GeneratedRepeatableQuest extends RepeatableQuest {
    requiredQuantity: number;
    finalCoinReward: number;
}

export interface PlayerRepeatableQuest {
    questId: string;
    boardId: string; // The POI id of the board
    generatedQuest: GeneratedRepeatableQuest;
    progress: number;
}

export interface RepeatableQuestsState {
    boards: Record<string, GeneratedRepeatableQuest[]>;
    activePlayerQuest: PlayerRepeatableQuest | null;
    nextResetTimestamp: number;
    completedQuestIds: string[];
    boardCompletions: Record<string, number>;
}