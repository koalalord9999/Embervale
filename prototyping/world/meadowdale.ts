import { WorldEntity } from '../worldData';

// 0 = Grass
// 1 = Hard Obstacle (Rock, Tree border)
// 2 = Building Wall (Wood/Stone)
// 3 = Path
// 4 = Water
// 5 = Floor (Wood)

const W = 1; // Wall (Perimeter/Hard)
const G = 0; // Grass
const B = 2; // Building Wall
const P = 3; // Path
const A = 4; // Water (Aqua)
const F = 5; // Floor

// 40x40 Grid representing Meadowdale
const rawGrid = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0, 1],
    [1, 0, 0, 2, 5, 5, 5, 5, 5, 2, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 0, 0, 0, 0, 0, 2, 5, 5, 5, 5, 5, 5, 5, 2, 0, 0, 0, 1],
    [1, 0, 0, 2, 5, 5, 5, 5, 5, 2, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 0, 0, 0, 0, 0, 2, 5, 5, 5, 5, 5, 5, 5, 2, 0, 0, 0, 1],
    [1, 0, 0, 2, 5, 5, 5, 5, 5, 2, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 0, 0, 0, 0, 0, 2, 5, 5, 5, 5, 5, 5, 5, 2, 0, 0, 0, 1],
    [1, 0, 0, 2, 2, 3, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 3, 2, 2, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 2, 5, 5, 5, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 0, 0, 0, 0, 0, 0, 2, 5, 5, 5, 2, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 2, 5, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 0, 0, 0, 0, 0, 0, 2, 2, 5, 2, 2, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 2, 5, 5, 5, 5, 5, 5, 2, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 2, 5, 5, 5, 5, 5, 5, 2, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 2, 5, 5, 5, 5, 5, 5, 2, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 2, 2, 2, 3, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1],
    [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4, 4, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
    [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4, 4, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
    [1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1],
    [1, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0, 1],
    [1, 0, 0, 2, 5, 5, 5, 5, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 0, 0, 0, 0, 0, 0, 2, 5, 5, 5, 5, 5, 5, 2, 0, 0, 0, 1],
    [1, 0, 0, 2, 5, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 0, 0, 0, 0, 0, 0, 2, 5, 5, 5, 5, 5, 5, 2, 0, 0, 0, 1],
    [1, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 0, 0, 0, 0, 0, 0, 2, 2, 3, 2, 2, 2, 2, 2, 0, 0, 0, 1],
    [1, 0, 0, 0, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 1],
    [1, 0, 0, 2, 5, 5, 5, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 0, 0, 0, 0, 0, 0, 2, 5, 5, 5, 5, 5, 2, 0, 0, 0, 0, 1],
    [1, 0, 0, 2, 5, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 0, 0, 0, 0, 0, 0, 2, 5, 5, 5, 5, 5, 2, 0, 0, 0, 0, 1],
    [1, 0, 0, 2, 2, 3, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 0, 0, 0, 0, 0, 0, 2, 2, 3, 2, 2, 2, 2, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 2, 5, 5, 5, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 2, 5, 5, 5, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];

// Transpose to access as [x][y]
export const meadowdaleGrid = rawGrid[0].map((_, colIndex) => rawGrid.map(row => row[colIndex]));

export const meadowdaleEntities: WorldEntity[] = [
    // -- Center --
    { id: 'fountain', name: 'Fountain', x: 20, y: 20, spawnX: 20, spawnY: 20, type: 'object', color: '#3b82f6', activityId: 'Collect Water' },
    { id: 'fitzwilliam', name: 'Old Man Fitzwilliam', x: 18, y: 19, spawnX: 18, spawnY: 19, type: 'npc', color: '#eab308', activityId: 'Old Man Fitzwilliam' },
    
    // -- North --
    { id: 'library_elara', name: 'Librarian Elara', x: 5, y: 5, spawnX: 5, spawnY: 5, type: 'npc', color: '#a855f7', activityId: 'Librarian Elara' },
    { id: 'library_wizard', name: 'Wizard Elmsworth', x: 7, y: 5, spawnX: 7, spawnY: 5, type: 'npc', color: '#3b82f6', activityId: 'Wizard Elmsworth' },
    { id: 'town_hall_clerk', name: 'Clerk Augustus', x: 33, y: 5, spawnX: 33, spawnY: 5, type: 'npc', color: '#f59e0b', activityId: 'Clerk Augustus' },
    { id: 'magic_shop_sign', name: 'Magic Shop', x: 4, y: 12, spawnX: 4, spawnY: 12, type: 'object', color: '#8b5cf6', activityId: 'meadowdale_magic' },

    // -- West --
    { id: 'bank_sign', name: 'Bank', x: 5, y: 16, spawnX: 5, spawnY: 16, type: 'object', color: '#f59e0b', activityId: 'meadowdale_bank' }, 
    { id: 'fishing_shop_sign', name: 'Fishing Shop', x: 4, y: 26, spawnX: 4, spawnY: 26, type: 'object', color: '#3b82f6', activityId: 'meadowdale_fishing' },
    
    // -- South --
    { id: 'general_store_sign', name: 'General Store', x: 5, y: 36, spawnX: 5, spawnY: 36, type: 'object', color: '#10b981', activityId: 'general_store' },
    { id: 'kitchen_range', name: 'Cooking Range', x: 5, y: 32, spawnX: 5, spawnY: 32, type: 'object', color: '#ef4444', activityId: 'cooking_range' },

    // -- East --
    { id: 'smithy_furnace', name: 'Furnace', x: 32, y: 26, spawnX: 32, spawnY: 26, type: 'object', color: '#f97316', activityId: 'furnace' },
    { id: 'smithy_anvil', name: 'Anvil', x: 34, y: 26, spawnX: 34, spawnY: 26, type: 'object', color: '#78350f', activityId: 'anvil' },
    { id: 'valerius', name: 'Valerius', x: 33, y: 25, spawnX: 33, spawnY: 25, type: 'npc', color: '#eab308', activityId: 'Valerius the Master Smith' },
    { id: 'inn_grimley', name: 'Barkeep Grimley', x: 33, y: 32, spawnX: 33, spawnY: 32, type: 'npc', color: '#eab308', activityId: 'Barkeep Grimley' },
    { id: 'inn_board', name: 'Quest Board', x: 31, y: 32, spawnX: 31, spawnY: 32, type: 'object', color: '#84cc16', activityId: 'quest_board' },

    // -- Misc NPCs --
    { id: 'man_1', name: 'Man', x: 22, y: 25, spawnX: 22, spawnY: 25, type: 'npc', color: '#9ca3af', activityId: 'Man', pickpocket: { lootTableId: 'pickpocket_man_woman_table' }, wanderRange: 4 },
    { id: 'woman_1', name: 'Woman', x: 18, y: 22, spawnX: 18, spawnY: 22, type: 'npc', color: '#9ca3af', activityId: 'Woman', pickpocket: { lootTableId: 'pickpocket_man_woman_table' }, wanderRange: 4 },
    
    // -- Random Combat --
    { id: 'goblin_1', name: 'Smart Goblin', x: 35, y: 15, spawnX: 35, spawnY: 15, type: 'npc', color: '#4ade80', monsterId: 'goblin', wanderRange: 4, aiType: 'smart', leashRange: 8 },
    { id: 'goblin_2', name: 'Dumb Goblin', x: 25, y: 8, spawnX: 25, spawnY: 8, type: 'npc', color: '#4ade80', monsterId: 'goblin', wanderRange: 4, aiType: 'basic', leashRange: 8 },

];