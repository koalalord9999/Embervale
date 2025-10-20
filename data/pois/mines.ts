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
        connections: ['stonebreak_mine', 'crystal_cavern', 'warrens_entrance', 'dwarven_outpost_entrance', 'rune_essence_mine'],
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
                pickpocket: { lootTableId: 'pickpocket_dwarf_table' },
                attackableMonsterId: 'dwarf',
                dialogue: {
                    start: {
                        npcName: 'Prospector Gudrun',
                        npcIcon: '/assets/npcChatHeads/prospector_gudrun.png',
                        text: "Careful down here, friend. It's not just rocks and ore you'll find.\n\nSome of the lads swear they've seen veins of ore that glow with a strange, silvery-blue light. They call it Mithril. Nonsense, I say.\n\nAnd don't even get me started on the legends of Adamantite... dark green metal, harder than steel. Found only at the highest peaks, they say.",
                        responses: []
                    }
                },
                startNode: 'start',
                dialogueType: 'random',
            },
            { type: 'thieving_lockpick', id: 'md_chest_1', targetName: 'Abandoned Chest', lootTableId: 'thieving_dungeon_chest_low' },
        ],
        regionId: 'wilderness',
        x: 1400, y: 1000
    },
    crystal_cavern: {
        id: 'crystal_cavern',
        name: 'Crystal Cavern',
        description: 'A breathtaking dead-end cavern where immense crystals cast a faint, ethereal light. The air hums with a faint power.',
        connections: ['mine_depths', 'stone_altar'],
        activities: [
            { type: 'thieving_lockpick', id: 'cc_chest_1', targetName: 'Crystalline Chest', lootTableId: 'thieving_dungeon_chest_mid' },
            { type: 'skilling', id: 'crystal_cavern_silver_1', name: 'Mine Silver Rock', skill: SkillName.Mining, requiredLevel: 20, loot: [{ itemId: 'silver_ore', chance: 1, xp: 40 }], resourceCount: { min: 1, max: 3 }, respawnTime: 18000, gatherTime: 4000 },
        ],
        regionId: 'wilderness',
        x: 1500, y: 1060
    },
    stone_altar: {
        id: 'stone_altar',
        name: 'Altar of the Deep',
        description: 'A monolithic altar carved from the very bedrock of the world. It feels solid and immovable, humming with a low, terrestrial power.',
        connections: ['crystal_cavern'],
        activities: [
            { type: 'runecrafting_altar', runeId: 'stone_rune' },
            {
                type: 'npc',
                name: 'Use Resonator',
                icon: 'https://api.iconify.design/game-icons:orb-wand.svg',
                questCondition: { questId: 'the_arcane_awakening', stages: [0] },
                startNode: 'use_resonator_stone',
            },
        ],
        regionId: 'wilderness',
        x: 1560, y: 1100,
    },
    rune_essence_mine: {
        id: 'rune_essence_mine',
        name: 'Rune Essence Mine',
        description: 'A cavern filled with strange, floating rocks that hum with a pure, magical energy.',
        connections: ['mine_depths'],
        activities: [
            { type: 'skilling', id: 'rune_essence_mine_1', name: 'Mine Rune Essence', skill: SkillName.Mining, requiredLevel: 1, loot: [{ itemId: 'rune_essence', chance: 1, xp: 5 }], resourceCount: { min: 999999, max: 999999 }, respawnTime: 5000, gatherTime: 4200, questCondition: { questId: 'magical_runestone_discovery', stages: [2, 3, 4, 5, 6], visibleAfterCompletion: true } },
            {
                type: 'npc',
                name: 'Wizard Elmsworth (Projection)',
                icon: 'https://api.iconify.design/game-icons:wizard-face.svg',
                questCondition: { questId: 'magical_runestone_discovery', stages: [1, 2, 3] },
                startNode: 'in_progress_magical_runestone_discovery_1'
            }
        ],
        unlockRequirement: { type: 'quest', questId: 'magical_runestone_discovery', stage: 1 },
        regionId: 'wilderness',
        x: 1400, y: 927,
    },
};