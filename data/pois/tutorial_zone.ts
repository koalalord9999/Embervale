import { POI, SkillName } from '../../types';

export const tutorialZonePois: Record<string, POI> = {
    enclave_start: {
        id: 'enclave_start',
        name: 'Ember Kinship Enclave',
        description: 'A small, tidy hut. A man in simple traveler\'s clothes gives you a welcoming smile. This seems to be where your journey begins.',
        connections: ['enclave_sparring_area'],
        activities: [
            {
                type: 'npc',
                name: 'Leo the Guide',
                icon: '/assets/npcChatHeads/tavern_regular.png',
                dialogue: {
                    start: {
                        npcName: 'Leo the Guide',
                        npcIcon: '/assets/npcChatHeads/tavern_regular.png',
                        text: "Welcome, newcomer. Ready to learn the ropes?",
                        responses: []
                    }
                },
                startNode: 'start'
            }
        ],
        regionId: 'wilderness',
        x: 50, y: 50,
    },
    enclave_sparring_area: {
        id: 'enclave_sparring_area',
        name: 'Enclave Sparring Area',
        description: 'A small, cleared area with a training dummy set up in the center. A path leads east to a patch of forest.',
        connections: ['enclave_start', 'enclave_forest_patch'],
        activities: [
            { type: 'combat', monsterId: 'training_dummy' }
        ],
        regionId: 'wilderness',
        x: 100, y: 50,
    },
    enclave_forest_patch: {
        id: 'enclave_forest_patch',
        name: 'Enclave Forest Patch',
        description: 'A small patch of woods with a few sturdy-looking trees. An unusually large rat scuttles nearby. A path leads south to a small mine.',
        connections: ['enclave_sparring_area', 'enclave_mine'],
        activities: [
            { type: 'skilling', id: 'tutorial_tree', name: 'Chop Tree', skill: SkillName.Woodcutting, requiredLevel: -40, loot: [{ itemId: 'logs', chance: 1, xp: 25 }], resourceCount: { min: 1, max: 1 }, respawnTime: 1000, gatherTime: 1500 },
            { type: 'combat', monsterId: 'tutorial_rat' }
        ],
        regionId: 'wilderness',
        x: 150, y: 50,
    },
    enclave_mine: {
        id: 'enclave_mine',
        name: 'Enclave Mine',
        description: 'A small, open-air mine with a few promising-looking rocks. A path leads east to a simple forge.',
        connections: ['enclave_forest_patch', 'enclave_forge'],
        activities: [
            { type: 'skilling', id: 'tutorial_copper', name: 'Mine Copper', skill: SkillName.Mining, requiredLevel: -40, loot: [{ itemId: 'copper_ore', chance: 1, xp: 18 }], resourceCount: { min: 1, max: 1 }, respawnTime: 1000, gatherTime: 1500 },
            { type: 'skilling', id: 'tutorial_tin', name: 'Mine Tin', skill: SkillName.Mining, requiredLevel: -40, loot: [{ itemId: 'tin_ore', chance: 1, xp: 18 }], resourceCount: { min: 1, max: 1 }, respawnTime: 1000, gatherTime: 1500 },
        ],
        regionId: 'wilderness',
        x: 150, y: 100,
    },
    enclave_forge: {
        id: 'enclave_forge',
        name: 'Enclave Forge',
        description: 'A simple outdoor forge, complete with a furnace and anvil. The path leads north to the departure point.',
        connections: ['enclave_mine', 'enclave_departure_point'],
        activities: [
            { type: 'furnace' },
            { type: 'anvil' },
        ],
        regionId: 'wilderness',
        x: 200, y: 100,
    },
    enclave_departure_point: {
        id: 'enclave_departure_point',
        name: 'Enclave Departure Point',
        description: 'The path ends at a cliff overlooking a bustling town in the distance. Leo the Guide is waiting for you here.',
        connections: ['enclave_forge'],
        activities: [
            {
                type: 'npc',
                name: 'Leo the Guide',
                icon: '/assets/npcChatHeads/tavern_regular.png',
                dialogue: {
                    start: {
                        npcName: 'Leo the Guide',
                        npcIcon: '/assets/npcChatHeads/tavern_regular.png',
                        text: "This is it. Ready to go?",
                        responses: []
                    }
                },
                startNode: 'start'
            }
        ],
        regionId: 'wilderness',
        x: 200, y: 50,
    },
};
