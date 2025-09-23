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
  | { type: 'kill'; monsterId: string; quantity: number }
  | { type: 'talk'; poiId: string; npcName: string }
  | { type: 'shear'; quantity: number }
  | { type: 'smith'; itemId: string; quantity: number }
  | { type: 'spin'; quantity: number };

export interface QuestStage {
  description: string;
  requirement: QuestRequirement;
  stageRewards?: { xp?: { skill: SkillName; amount: number }[]; items?: InventorySlot[]; coins?: number };
}

export interface DialogueResponse {
    text: string;
    next?: string; // Key of the next DialogueNode
    action?: 'accept_quest' | 'close' | 'custom' | 'complete_stage';
    questId?: string;
    customActionId?: string;
    items?: InventorySlot[];
    itemsToConsume?: { itemId: string; quantity: number }[];
    failureNext?: string; // Key of the next DialogueNode if the action fails
}

export interface DialogueNode {
    npcName: string;
    npcIcon: string;
    text: string;
    responses: DialogueResponse[];
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