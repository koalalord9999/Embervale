import { EquipmentSlot, MonsterType, SkillName, ToolType, WeaponType } from './enums';
import { GuaranteedDrop, WeightedDrop, TertiaryDrop } from './drops';
import { SpellElement } from './spells';

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
    runeType?: string; // e.g., 'gust_rune'
    isTwoHanded?: boolean;
    magicAttribute?: SpellElement;
    providesRune?: string;
}


export interface Item {
  id: string;
  name: string;
  description: string;
  stackable: boolean;
  value: number; // Value for selling/buying
  iconUrl: string;
  doseable?: boolean;
  maxDoses?: number;
  initialDoses?: number;
  charges?: number;
  equipment?: EquipmentStats & { slot: EquipmentSlot };
  consumable?: { 
    healAmount?: number; 
    statModifiers?: { 
        skill: SkillName; 
        value?: number;
        base?: number;
        percent?: number;
        duration: number; 
    }[];
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
    potionEffect?: { description: string };
    special?: 'treasure_chest';
  };
  buryable?: { prayerXp: number };
  tool?: { type: ToolType; power: number };
  cleanable?: { cleanItemId: string; xp: number };
  emptyable?: { emptyItemId: string };
  divining?: { poiId: string; };
  runecrafting?: { xp: number; runeId: string; requiredLevel: number; };
  material?: 'bronze' | 'iron' | 'steel' | 'mithril' | 'adamantite' | 'runic' | 'aquatite' | 'copper' | 'tin' | 'iron-ore' | 'mithril-ore' | 'adamantite-ore' | 'titanium-ore' | 'silver' | 'coal' | 'raw-fish' | 'raw-meat' | 'cooked-fish' | 'cooked-meat' | 'burnt' | 'sapphire' | 'uncut-sapphire' | 'emerald' | 'uncut-emerald' | 'ruby' | 'uncut-ruby' | 'diamond' | 'uncut-diamond' | 'leather' | 'wizard-blue' | 'gold' | 'wood-normal' | 'wood-oak' | 'wood-willow' | 'wood-feywood' | 'wood-yew' | 'wood-driftwood' | 'wood-mahogany' | 'grimy-herb' | 'clean-herb' | 'unfinished-potion' | 'potion' | 'vial' | 'vial-water' | 'potion-weak-attack' | 'potion-attack' | 'potion-super-attack' | 'potion-weak-strength' | 'potion-strength' | 'potion-super-strength' | 'potion-weak-defence' | 'potion-defence' | 'potion-super-defence' | 'potion-weak-ranged' | 'potion-ranged' | 'potion-super-ranged' | 'potion-weak-magic' | 'potion-magic' | 'potion-super-magic' | 'potion-antipoison' | 'potion-super-antipoison' | 'potion-poison' | 'potion-restore' | 'potion-prayer' | 'potion-combo' | 'potion-weak-mining' | 'potion-mining' | 'potion-weak-smithing' | 'potion-smithing' | 'potion-weak-woodcutting' | 'potion-woodcutting' | 'potion-weak-fletching' | 'potion-fletching' | 'potion-weak-crafting' | 'potion-crafting' | 'potion-weak-fishing' | 'potion-fishing' | 'potion-weak-herblore' | 'potion-herblore' | 'potion-antifire' | 'potion-stamina' | 'rune-gust' | 'rune-binding' | 'rune-stone' | 'rune-aqua' | 'rune-ember' | 'rune-flux' | 'rune-verdant' | 'rune-nexus' | 'rune-hex' | 'rune-passage' | 'rune-anima' | 'rune-astral' | 'rune-aether';
}

export interface InventorySlot {
  itemId: string;
  quantity: number;
  doses?: number;
  noted?: boolean;
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
  ranged?: number;
  magic?: number;
  // Defence stats
  stabDefence: number;
  slashDefence: number;
  crushDefence: number;
  rangedDefence: number;
  magicDefence: number;
  // Other
  iconUrl: string;
  guaranteedDrops?: GuaranteedDrop[];
  mainDrops?: WeightedDrop[];
  tertiaryDrops?: TertiaryDrop[];
  monsterType: MonsterType;
  attackSpeed: number; // In game ticks
  respawnTime: number; // In milliseconds
  attackStyle: 'stab' | 'slash' | 'crush' | 'ranged' | 'magic';
  specialAttacks?: { name: string; chance: number; effect: 'damage_multiplier'; value: number }[];
  aggressive: boolean;
  alwaysAggressive?: boolean;
  customMaxHit?: number;
  elementalWeakness?: SpellElement;
}

export interface WorldState {
    windmillFlour: number;
}