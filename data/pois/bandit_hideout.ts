
import { POI } from '../../types';

export const banditHideoutPois: Record<string, POI> = {
    bandit_hideout_entrance: {
        id: 'bandit_hideout_entrance',
        name: 'Bandit Hideout',
        description: 'A cleverly hidden cave entrance, littered with discarded crates and barrels. A crude path leads inside.',
        connections: ['kings_road_west_2', 'bandit_hideout_cave_1'],
        activities: [
            { type: 'combat', monsterId: 'bandit_marksman' }
        ],
        regionId: 'wilderness',
        x: 759, y: 1776
    },
    bandit_hideout_cave_1: {
        id: 'bandit_hideout_cave_1',
        name: 'Main Cavern',
        description: 'The cave opens into a large cavern, serving as the bandits\' main living quarters. An underground stream flows through one side.',
        connections: ['bandit_hideout_entrance', 'bandit_leader_lair'],
        activities: [
            { type: 'combat', monsterId: 'bandit_bruiser' },
            { type: 'combat', monsterId: 'bandit_bruiser' },
            { type: 'combat', monsterId: 'bandit_marksman' },
            { type: 'thieving_lockpick', id: 'bh_main_chest_1', targetName: 'Bandit\'s Chest', lootTableId: 'thieving_dungeon_chest_mid' },
        ],
        regionId: 'wilderness',
        x: 727, y: 1743
    },
    bandit_leader_lair: {
        id: 'bandit_leader_lair',
        name: 'Bandit Leader\'s Lair',
        description: 'A smaller, torch-lit chamber at the back of the cave. Piles of stolen goods are stacked against the walls, guarded by the bandit leader.',
        connections: ['bandit_hideout_cave_1'],
        activities: [
            { type: 'combat', monsterId: 'bandit_leader' },
            { type: 'thieving_lockpick', id: 'bh_leader_chest_1', targetName: 'Leader\'s Chest', lootTableId: 'thieving_dungeon_chest_high' },
        ],
        regionId: 'wilderness',
        x: 762, y: 1728
    },
};
