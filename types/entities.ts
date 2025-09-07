import { EquipmentSlot, MonsterType, SkillName, ToolType, WeaponType } from './enums';

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
