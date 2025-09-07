

export interface PlayerSlayerTask {
    monsterId: string;
    requiredCount: number;
    progress: number;
    isComplete: boolean;
}

export enum SkillName {
  Attack = "Attack",
  Strength = "Strength",
  Defence = "Defence",
  Ranged = "Ranged",
  Magic = "Magic",
  Hitpoints = "Hitpoints",
  Prayer = "Prayer",
  Woodcutting = "Woodcutting",
  Fletching = "Fletching",
  Firemaking = "Firemaking",
  Fishing = "Fishing",
  Cooking = "Cooking",
  Crafting = "Crafting",
  Mining = "Mining",
  Smithing = "Smithing",
  Herblore = "Herblore",
  Runecrafting = "Runecrafting",
  Slayer = "Slayer",
}

export enum EquipmentSlot {
    Weapon = "Weapon",
    Shield = "Shield",
    Head = "Head",
    Body = "Body",
    Legs = "Legs",
    Ammo = "Ammo",
    Gloves = "Gloves",
    Boots = "Boots",
    Cape = "Cape",
    Necklace = "Necklace",
    Ring = "Ring",
}

export enum CombatStance {
    // Melee
    Accurate = "Accurate",
    Aggressive = "Aggressive",
    Defensive = "Defensive",
    // Ranged
    RangedAccurate = "Ranged Accurate",
    RangedRapid = "Ranged Rapid",
    RangedDefence = "Ranged Defence",
}

export enum WeaponType {
    Unarmed = "Unarmed",
    Dagger = "Dagger",
    Sword = "Sword",
    Scimitar = "Scimitar",
    Mace = "Mace",
    Axe = "Axe",
    Battleaxe = "Battleaxe",
    Warhammer = "Warhammer",
    Bow = "Bow",
}

export enum MonsterType {
    Standard = "Standard",
    Armored = "Armored",
    Undead = "Undead",
}

export enum ToolType {
    Axe = "Axe",
    Pickaxe = "Pickaxe",
    Knife = "Knife",
}

export interface PlayerSkill {
  name: SkillName;
  level: number;
  xp: number;
}

export interface EquipmentStats {
    // Attack Bonuses
    stabAttack: number;
    slashAttack: number;
    crushAttack: number;
    rangedAttack: number;
    magicAttack: number;
    // Defence Bonuses
    stabDefence: number;
    slashDefence: number;
    crushDefence: number;
    rangedDefence: number;
    magicDefence: number;
    // Other Bonuses
    strengthBonus: number;
    rangedStrength: number;
    magicDamageBonus: number; // e.g. 5 for +5% damage
    // Weapon Stats
    weaponType?: WeaponType;
    speed?: number; // In game ticks, lower is faster
    requiredLevels?: { skill: SkillName; level: number }[];
}


export interface Item {
  id: string;
  name: string;
  description: string;
  stackable: boolean;
  value: number; // Value for selling/buying
  iconUrl: string;
  equipment?: EquipmentStats & { slot: EquipmentSlot };
  consumable?: { 
    healAmount?: number; 
    statModifiers?: { skill: SkillName; value: number; duration: number; }[];
    givesCoins?: { min: number; max: number; };
    curesPoison?: boolean; 
    buffs?: { 
        type: 'recoil' | 'flat_damage' | 'poison_on_hit' | 'accuracy_boost' | 'evasion_boost' | 'damage_on_hit' | 'attack_speed_boost' | 'poison_immunity' | 'damage_reduction'; 
        value: number; 
        duration: number; 
        chance?: number; 
        poison_damage?: number;
        style?: 'melee' | 'ranged' | 'all';
    }[]; 
  };
  buryable?: { prayerXp: number };
  tool?: { type: ToolType; power: number };
  cleanable?: { cleanItemId: string; xp: number };
  potionEffect?: { description: string };
  material?: 'bronze' | 'iron' | 'steel' | 'mithril' | 'adamantite' | 'runic' | 'aquatite' | 'copper' | 'tin' | 'iron-ore' | 'mithril-ore' | 'adamantite-ore' | 'titanium-ore' | 'silver' | 'coal' | 'raw-fish' | 'raw-meat' | 'cooked-fish' | 'cooked-meat' | 'burnt' | 'sapphire' | 'uncut-sapphire' | 'emerald' | 'uncut-emerald' | 'ruby' | 'uncut-ruby' | 'leather' | 'gold' | 'grimy-herb' | 'clean-herb' | 'unfinished-potion' | 'potion';
}

export interface InventorySlot {
  itemId: string;
  quantity: number;
}

export interface Equipment {
  weapon: InventorySlot | null;
  shield: InventorySlot | null;
  head: InventorySlot | null;
  body: InventorySlot | null;
  legs: InventorySlot | null;
  ammo: InventorySlot | null;
  gloves: InventorySlot | null;
  boots: InventorySlot | null;
  cape: InventorySlot | null;
  necklace: InventorySlot | null;
  ring: InventorySlot | null;
}

export interface Monster {
  id: string;
  name: string;
  level: number;
  maxHp: number;
  attack: number;
  // Defence stats
  stabDefence: number;
  slashDefence: number;
  crushDefence: number;
  rangedDefence: number;
  magicDefence: number;
  // Other
  iconUrl: string;
  drops: { itemId?: string; tableId?: string; chance: number; minQuantity?: number; maxQuantity?: number }[];
  monsterType: MonsterType;
  attackSpeed: number; // In game ticks
  respawnTime: number; // In milliseconds
  attackStyle: 'stab' | 'slash' | 'crush' | 'ranged' | 'magic';
  specialAttacks?: { name: string; chance: number; effect: 'damage_multiplier'; value: number }[];
  aggressive: boolean;
  alwaysAggressive?: boolean;
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
  // FIX: Added 'dungeon' to the Region type to support dungeon maps and fix related type errors.
  type: 'city' | 'region' | 'dungeon';
  entryPoiId: string;
  x: number; // World map x
  y: number; // World map y
}

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

export type QuestRequirement =
  | { type: 'gather'; itemId: string; quantity: number }
  | { type: 'kill'; monsterId: string; quantity: number }
  | { type: 'talk'; poiId: string; npcName: string }
  | { type: 'shear'; quantity: number }
  | { type: 'spin'; quantity: number };

export interface QuestStage {
  description: string;
  requirement: QuestRequirement;
}

export interface DialogueResponse {
    text: string;
    next?: string; // Key of the next DialogueNode
    action?: 'accept_quest' | 'close' | 'custom';
    customActionId?: string;
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
  startPoi: string;
  stages: QuestStage[];
  rewards: { xp?: { skill: SkillName; amount: number }[]; items?: InventorySlot[]; coins?: number };
  isHidden?: boolean;
  dialogue?: Record<string, DialogueNode>;
  startDialogueNode?: string;
  startHint: string;
  playerStagePerspectives: string[];
  completionSummary: string;
}

export interface PlayerQuestState {
    questId: string;
    currentStage: number;
    progress: number; // e.g., items gathered or monsters killed
    isComplete: boolean;
}

export interface Shop {
    id: string;
    name: string;
    inventory: { itemId: string; quantity: number; priceModifier: number }[]; // modifier for buying/selling
}

export interface ShopItemState {
    itemId: string;
    currentStock: number;
    restockProgress: number; // in milliseconds
}

export type ShopStates = Record<string, Record<string, ShopItemState>>; // { [shopId]: { [itemId]: ShopItemState } }

export interface CookingRecipe {
    itemId: string; // The item you get from cooking
    level: number;
    xp: number;
    ingredients: { itemId: string; quantity: number }[];
    burntItemId: string;
}

export interface CraftingRecipe {
    itemId: string;
    level: number;
    xp: number;
    ingredients: { itemId: string; quantity: number }[];
}

export interface ResourceNodeState {
    resources: number;
    respawnTimer: number; // in ms
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

export interface SkillGuideEntry {
    level: number;
    description: string;
    itemId?: string;
}

export interface ActiveCraftingAction {
    recipeId: string;
    // Distinguishes between different types of recipes that might share item IDs
    recipeType: 'smithing-bar' | 'smithing-item' | 'fletching-carve' | 'fletching-string' | 'fletching-headless' | 'fletching-tip' | 'crafting' | 'gem-cutting' | 'spinning' | 'cooking' | 'herblore-unfinished' | 'herblore-finished';
    totalQuantity: number;
    completedQuantity: number;
    startTime: number;
    duration: number; // ms per item
    // Optional payload for specific recipe types
    payload?: {
        logId?: string; // for fletching-carve
        unstrungId?: string; // for fletching-string
        tipId?: string; // for fletching-tip
        barType?: 'bronze_bar' | 'iron_bar' | 'steel_bar' | 'silver_bar' | 'mithril_bar' | 'adamantite_bar' | 'runic_bar'; // for smithing-bar
        uncutId?: string; // for gem-cutting
        cleanHerbId?: string; // for herblore-unfinished
        unfinishedPotionId?: string; // for herblore-finished
        secondaryId?: string; // for herblore-finished
    }
}

export type ActivePanel = 'inventory' | 'skills' | 'quests' | 'equipment' | 'crafting' | 'map' | 'bank' | null;