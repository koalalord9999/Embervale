
import { POI, SkillName } from '../../types';

export const farmlandsPois: Record<string, POI> = {
    mcgregors_ranch: {
        id: 'mcgregors_ranch',
        name: "McGregor's Ranch",
        description: "A well-kept ranch with a sturdy farmhouse and several outbuildings. The air smells of hay and livestock. A well-trodden path leads west into open fields.",
        connections: ['meadowdale_west_gate', 'sheep_pen', 'cow_pasture', 'chicken_coop', 'mcgregors_barn', 'verdant_fields_entrance', 'flax_field'],
        activities: [
            { 
                type: 'npc', 
                name: 'Rancher McGregor', 
                icon: '/assets/npcChatHeads/rancher_mcgregor.png',
                dialogue: ["Howdy, stranger. It's a fine day for work, ain't it?"]
            },
            { type: 'quest_start', questId: 'sheep_troubles' },
            { type: 'skilling', id: 'mcgregors_ranch_tree', name: 'Chop Tree', skill: SkillName.Woodcutting, requiredLevel: 1, loot: [{ itemId: 'logs', chance: 0.8, xp: 25 }], resourceCount: { min: 1, max: 3 }, respawnTime: 15000, gatherTime: 2000 },
        ],
        regionId: 'wilderness',
        x: 800, y: 1200
    },
    flax_field: {
        id: 'flax_field',
        name: 'Flax Field',
        description: 'A field of tall, flowering flax plants.',
        connections: ['mcgregors_ranch'],
        activities: [
            { type: 'skilling', id: 'flax_field_gathering', name: 'Pick Flax', skill: SkillName.Crafting, requiredLevel: 1, loot: [{ itemId: 'flax', chance: 1, xp: 1 }], resourceCount: { min: 10, max: 20 }, respawnTime: 20000, gatherTime: 1500 }
        ],
        regionId: 'wilderness',
        x: 860, y: 1200
    },
    mcgregors_barn: {
        id: 'mcgregors_barn',
        name: "McGregor's Barn",
        description: "The barn is tidy and smells of fresh hay. In the corner, a sturdy spinning wheel sits ready for use.",
        connections: ['mcgregors_ranch'],
        activities: [
            { type: 'spinning_wheel' }
        ],
        regionId: 'wilderness',
        x: 840, y: 1160
    },
    sheep_pen: {
        id: 'sheep_pen',
        name: "Sheep Pen",
        description: "A large pen filled with incredibly fluffy sheep. They bleat lazily as you approach.",
        connections: ['mcgregors_ranch'],
        activities: [
            { type: 'shearing', loot: { itemId: 'wool', chance: 1 } }
        ],
        regionId: 'wilderness',
        x: 760, y: 1160
    },
    cow_pasture: {
        id: 'cow_pasture',
        name: "Cow Pasture",
        description: "A field of placid-looking cows, chewing their cud and staring at you with large, vacant eyes.",
        connections: ['mcgregors_ranch'],
        activities: [
            { type: 'combat', monsterId: 'cow' },
            { type: 'combat', monsterId: 'cow' },
            { type: 'combat', monsterId: 'cow' },
            { type: 'combat', monsterId: 'cow' },
            { type: 'combat', monsterId: 'cow' }
        ],
        regionId: 'wilderness',
        x: 760, y: 1240
    },
    chicken_coop: {
        id: 'chicken_coop',
        name: "Chicken Coop",
        description: "A noisy, dusty coop filled with clucking chickens. There are nesting boxes along one wall.",
        connections: ['mcgregors_ranch'],
        activities: [
            { type: 'egg_collecting', loot: { itemId: 'eggs', chance: 1 } },
            { type: 'combat', monsterId: 'chicken' }
        ],
        regionId: 'wilderness',
        x: 840, y: 1240
    },
};