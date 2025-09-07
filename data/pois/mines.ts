

import { POI, SkillName } from '../../types';

export const minePois: Record<string, POI> = {
    stonebreak_mine: {
        id: 'stonebreak_mine',
        name: 'Stonebreak Mine',
        description: 'A dark and damp mine. The sound of pickaxes echoes in the distance, mixed with guttural growls.',
        connections: ['meadowdale_east_gate', 'mine_depths'],
        activities: [
            { type: 'skilling', id: 'stonebreak_copper_1', name: 'Mine Copper Rock', skill: SkillName.Mining, requiredLevel: 1, loot: [{ itemId: 'copper_ore', chance: 1, xp: 18 }], resourceCount: { min: 1, max: 1 }, respawnTime: 5000, gatherTime: 2500 },
            { type: 'skilling', id: 'stonebreak_tin_1', name: 'Mine Tin Rock', skill: SkillName.Mining, requiredLevel: 1, loot: [{ itemId: 'tin_ore', chance: 1, xp: 18 }], resourceCount: { min: 1, max: 1 }, respawnTime: 5000, gatherTime: 2500 },
            { type: 'skilling', id: 'stonebreak_large_copper_1', name: 'Mine Large Copper Rock', skill: SkillName.Mining, requiredLevel: 15, loot: [{ itemId: 'copper_ore', chance: 1, xp: 18 }], resourceCount: { min: 4, max: 10 }, respawnTime: 15000, gatherTime: 2500 },
            { type: 'skilling', id: 'stonebreak_large_tin_1', name: 'Mine Large Tin Rock', skill: SkillName.Mining, requiredLevel: 15, loot: [{ itemId: 'tin_ore', chance: 1, xp: 18 }], resourceCount: { min: 4, max: 10 }, respawnTime: 15000, gatherTime: 2500 },
            { type: 'combat', monsterId: 'goblin' }
        ],
        regionId: 'wilderness',
        x: 1300, y: 1000
    },
    mine_depths: {
        id: 'mine_depths',
        name: 'Mine Depths',
        description: 'Deeper into the earth, the air grows cold. A crude tunnel has been dug into one of the walls.',
        connections: ['stonebreak_mine', 'crystal_cavern', 'warrens_entrance'],
        activities: [
            { type: 'combat', monsterId: 'cave_slime' },
            { type: 'skilling', id: 'mine_depths_iron_1', name: 'Mine Iron Rock', skill: SkillName.Mining, requiredLevel: 15, loot: [{ itemId: 'iron_ore', chance: 1, xp: 35 }], resourceCount: { min: 1, max: 1 }, respawnTime: 8000, gatherTime: 3000 },
            { type: 'skilling', id: 'mine_depths_large_iron_1', name: 'Mine Large Iron Rock', skill: SkillName.Mining, requiredLevel: 30, loot: [{ itemId: 'iron_ore', chance: 1, xp: 35 }], resourceCount: { min: 4, max: 10 }, respawnTime: 20000, gatherTime: 3000 },
            { type: 'skilling', id: 'mine_depths_iron_2', name: 'Mine Iron Rock', skill: SkillName.Mining, requiredLevel: 15, loot: [{ itemId: 'iron_ore', chance: 1, xp: 35 }], resourceCount: { min: 1, max: 1 }, respawnTime: 8000, gatherTime: 3000 },
            { type: 'skilling', id: 'mine_depths_iron_3', name: 'Mine Iron Rock', skill: SkillName.Mining, requiredLevel: 15, loot: [{ itemId: 'iron_ore', chance: 1, xp: 35 }], resourceCount: { min: 1, max: 1 }, respawnTime: 8000, gatherTime: 3000 },
            {
                type: 'npc',
                name: 'Prospector Gudrun',
                icon: '/assets/npcChatHeads/prospector_gudrun.png',
                dialogue: [
                    "Careful down here, friend. It's not just rocks and ore you'll find.",
                    "Some of the lads swear they've seen veins of ore that glow with a strange, silvery-blue light. They call it Mithril. Nonsense, I say.",
                    "And don't even get me started on the legends of Adamantite... dark green metal, harder than steel. Found only at the highest peaks, they say."
                ]
            }
        ],
        regionId: 'wilderness',
        x: 1400, y: 1000
    },
    crystal_cavern: {
        id: 'crystal_cavern',
        name: 'Crystal Cavern',
        description: 'A breathtaking dead-end cavern where immense crystals cast a faint, ethereal light.',
        connections: ['mine_depths'],
        activities: [
            { type: 'skilling', id: 'crystal_cavern_sapphire_1', name: 'Mine Sapphire Crystal', skill: SkillName.Mining, requiredLevel: 20, loot: [{ itemId: 'uncut_sapphire', chance: 0.6, xp: 60 }], resourceCount: { min: 1, max: 1 }, respawnTime: 25000, gatherTime: 4000 },
            { type: 'skilling', id: 'crystal_cavern_emerald_1', name: 'Mine Emerald Crystal', skill: SkillName.Mining, requiredLevel: 25, loot: [{ itemId: 'uncut_emerald', chance: 0.6, xp: 80 }], resourceCount: { min: 1, max: 1 }, respawnTime: 35000, gatherTime: 4000 },
            { type: 'skilling', id: 'crystal_cavern_ruby_1', name: 'Mine Ruby Crystal', skill: SkillName.Mining, requiredLevel: 30, loot: [{ itemId: 'uncut_ruby', chance: 0.6, xp: 100 }], resourceCount: { min: 1, max: 1 }, respawnTime: 50000, gatherTime: 4000 },
        ],
        regionId: 'wilderness',
        x: 1500, y: 1060
    },
};