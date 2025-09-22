import { POI, SkillName } from '../../types';

export const galeSweptPeaksPois: Record<string, POI> = {
    ancient_pass: {
        id: 'ancient_pass',
        name: 'Ancient Pass',
        description: 'A narrow pass winding through the lower peaks. The air is thin and cold. The rocks here look rich with minerals.',
        connections: ['treacherous_ascent', 'goat_trail', 'frozen_creek', 'forgotten_outpost'],
        activities: [
            { type: 'skilling', id: 'ancient_pass_iron_1', name: 'Mine Iron Rock', skill: SkillName.Mining, requiredLevel: 15, loot: [{ itemId: 'iron_ore', chance: 1, xp: 35 }], resourceCount: { min: 2, max: 4 }, respawnTime: 8000, gatherTime: 3000 },
            { type: 'skilling', id: 'ancient_pass_coal_1', name: 'Mine Coal Rock', skill: SkillName.Mining, requiredLevel: 30, loot: [{ itemId: 'coal', chance: 1, xp: 50 }], resourceCount: { min: 1, max: 2 }, respawnTime: 12000, gatherTime: 3500 },
            { type: 'skilling', id: 'ancient_pass_mithril_1', name: 'Mine Mithril Rock', skill: SkillName.Mining, requiredLevel: 50, loot: [{ itemId: 'mithril_ore', chance: 1, xp: 80 }], resourceCount: { min: 1, max: 2 }, respawnTime: 20000, gatherTime: 4000 },
        ],
        regionId: 'gale_swept_peaks',
        x: 900, y: 500
    },
    forgotten_outpost: {
        id: 'forgotten_outpost',
        name: 'Forgotten Outpost',
        description: 'The stone ruins of a small, ancient outpost. It seems to have been abandoned for centuries.',
        connections: ['ancient_pass'],
        activities: [
            { type: 'combat', monsterId: 'stone_golem' }, // A weaker, solitary golem
            {
                type: 'npc',
                name: 'Echo of a Watchman',
                icon: '/assets/npcChatHeads/echo_of_a_watchman.png',
                // FIX: Converted string array to DialogueNode structure.
                dialogue: {
                    start: {
                        npcName: 'Echo of a Watchman',
                        npcIcon: '/assets/npcChatHeads/echo_of_a_watchman.png',
                        text: "...always watching... the north...\n\nThe great metal... they forged it with the mountain's heart... runs with purple fire...\n\nWe failed... the darkness from the swamp... it rose...",
                        responses: []
                    }
                },
                startNode: 'start'
            }
        ],
        regionId: 'gale_swept_peaks',
        x: 960, y: 540
    },
    frozen_creek: {
        id: 'frozen_creek',
        name: 'Frozen Creek',
        description: 'A quiet, dead-end creek where ice clings to the rocks. It is rich in mineral deposits and free from monsters.',
        connections: ['ancient_pass', 'icy_cave_mouth'],
        activities: [
            { type: 'skilling', id: 'frozen_creek_coal_1', name: 'Mine Coal Rock', skill: SkillName.Mining, requiredLevel: 30, loot: [{ itemId: 'coal', chance: 1, xp: 50 }], resourceCount: { min: 2, max: 4 }, respawnTime: 12000, gatherTime: 3500 },
            { type: 'skilling', id: 'frozen_creek_iron_1', name: 'Mine Iron Rock', skill: SkillName.Mining, requiredLevel: 15, loot: [{ itemId: 'iron_ore', chance: 1, xp: 35 }], resourceCount: { min: 3, max: 6 }, respawnTime: 8000, gatherTime: 3000 },
            { type: 'skilling', id: 'frozen_creek_mithril_1', name: 'Mine Mithril Rock', skill: SkillName.Mining, requiredLevel: 50, loot: [{ itemId: 'mithril_ore', chance: 1, xp: 80 }], resourceCount: { min: 2, max: 4 }, respawnTime: 20000, gatherTime: 4000 },
        ],
        regionId: 'gale_swept_peaks',
        x: 840, y: 460
    },
    icy_cave_mouth: {
        id: 'icy_cave_mouth',
        name: 'Icy Cave Mouth',
        description: 'A blast of frigid air emanates from this dark cave opening. The walls are coated in a thick layer of frost.',
        connections: ['frozen_creek', 'glittering_tunnels'],
        activities: [],
        regionId: 'gale_swept_peaks',
        x: 800, y: 420
    },
    glittering_tunnels: {
        id: 'glittering_tunnels',
        name: 'Glittering Tunnels',
        description: 'The walls of this tunnel are embedded with silver ore that glitters in your torchlight. The path ends here.',
        connections: ['icy_cave_mouth'],
        activities: [
            { type: 'skilling', id: 'glittering_tunnels_silver_1', name: 'Mine Silver Ore', skill: SkillName.Mining, requiredLevel: 40, loot: [{ itemId: 'silver_ore', chance: 1, xp: 60 }], resourceCount: { min: 3, max: 6 }, respawnTime: 18000, gatherTime: 4000 },
            { type: 'combat', monsterId: 'cave_slime' },
        ],
        regionId: 'gale_swept_peaks',
        x: 760, y: 380
    },
    goat_trail: {
        id: 'goat_trail',
        name: 'Goat Trail',
        description: 'A treacherous, narrow trail clinging to the mountainside. Sure-footed mountain goats leap from rock to rock with unnerving ease.',
        connections: ['ancient_pass', 'harpy_roost', 'cave_mouth', 'treacherous_ledge', 'high_meadow', 'borins_cave'],
        activities: [
            { type: 'combat', monsterId: 'mountain_goat' },
            { type: 'skilling', id: 'goat_trail_adamantite_1', name: 'Mine Adamantite Rock', skill: SkillName.Mining, requiredLevel: 65, loot: [{ itemId: 'adamantite_ore', chance: 1, xp: 120 }], resourceCount: { min: 1, max: 1 }, respawnTime: 45000, gatherTime: 5000 },
        ],
        regionId: 'gale_swept_peaks',
        x: 960, y: 440
    },
    borins_cave: {
        id: 'borins_cave',
        name: "Borin's Cave",
        description: "A small, secluded cave, surprisingly warm inside. A makeshift forge and anvil stand in the corner, along with a comfortable-looking cot.",
        connections: ['goat_trail'],
        activities: [
            { type: 'npc', name: 'Borin Stonehand', icon: '/assets/npcChatHeads/prospector_gudrun.png', 
                // FIX: Converted string array to DialogueNode structure.
                dialogue: {
                    start: {
                        npcName: 'Borin Stonehand',
                        npcIcon: '/assets/npcChatHeads/prospector_gudrun.png',
                        text: "What do you want? Can't you see I'm busy?",
                        responses: []
                    }
                },
                startNode: 'start'
             }
        ],
        regionId: 'gale_swept_peaks',
        x: 920, y: 400
    },
    high_meadow: {
        id: 'high_meadow',
        name: 'High Meadow',
        description: 'A surprisingly lush meadow high in the mountains. It is a peaceful respite from the harsh rock, but aggressive goats graze here.',
        connections: ['goat_trail'],
        activities: [
            { type: 'combat', monsterId: 'mountain_goat' },
            { type: 'combat', monsterId: 'mountain_goat' },
        ],
        regionId: 'gale_swept_peaks',
        x: 960, y: 520
    },
    cave_mouth: {
        id: 'cave_mouth',
        name: 'Wind-Carved Cave Mouth',
        description: 'A dark opening in the mountainside, from which a low growl can be heard. This path offers an alternative route, but it is likely dangerous.',
        connections: ['goat_trail', 'inner_caverns'],
        activities: [
            { type: 'combat', monsterId: 'cave_slime' }
        ],
        regionId: 'gale_swept_peaks',
        x: 1040, y: 440
    },
    inner_caverns: {
        id: 'inner_caverns',
        name: 'Inner Caverns',
        description: 'The damp interior of the mountain is crawling with slick, subterranean creatures.',
        connections: ['cave_mouth', 'harpy_roost'],
        activities: [
            { type: 'combat', monsterId: 'cave_slime' },
            { type: 'combat', monsterId: 'cave_slime' },
        ],
        regionId: 'gale_swept_peaks',
        x: 1060, y: 420
    },
    harpy_roost: {
        id: 'harpy_roost',
        name: 'Harpy Roost',
        description: 'High cliffs pockmarked with nests. Piercing shrieks echo as winged figures circle overhead. A chasm is spanned by a dangerously frayed rope bridge.',
        connections: ['goat_trail', 'summit_approach', 'inner_caverns', 'eagles_eyrie'],
        activities: [
            { type: 'combat', monsterId: 'harpy' },
            { type: 'combat', monsterId: 'harpy' },
        ],
        connectionRequirements: {
            summit_approach: {
                skill: SkillName.Crafting,
                level: 25,
                xp: 300,
                description: "A rickety rope bridge sways precariously over a deep chasm. It needs to be repaired to be crossed safely.",
                actionText: "Repair Bridge"
            }
        },
        regionId: 'gale_swept_peaks',
        x: 1020, y: 380
    },
    eagles_eyrie: {
        id: 'eagles_eyrie',
        name: "Eagle's Eyrie",
        description: 'A secluded, windswept ledge high in the peaks. A single, ancient yew tree grows here, undisturbed.',
        connections: ['harpy_roost'],
        activities: [
            { type: 'skilling', id: 'eagles_eyrie_yew_1', name: 'Chop Ancient Yew', skill: SkillName.Woodcutting, requiredLevel: 65, loot: [{ itemId: 'yew_logs', chance: 1, xp: 175 }], resourceCount: { min: 2, max: 4 }, respawnTime: 60000, gatherTime: 5000 },
        ],
        regionId: 'gale_swept_peaks',
        x: 960, y: 340
    },
    summit_approach: {
        id: 'summit_approach',
        name: 'Summit Approach',
        description: 'The path grows steeper, leading above the treeline. The wind howls relentlessly. A few hardy, ancient yew trees cling to the rock.',
        connections: ['harpy_roost', 'the_summit', 'treacherous_ledge', 'frozen_lake'],
        activities: [
            { type: 'skilling', id: 'summit_approach_yew_1', name: 'Chop Yew Tree', skill: SkillName.Woodcutting, requiredLevel: 65, loot: [{ itemId: 'yew_logs', chance: 1, xp: 175 }], resourceCount: { min: 1, max: 2 }, respawnTime: 60000, gatherTime: 5000 },
            { type: 'combat', monsterId: 'harpy' },
        ],
        regionId: 'gale_swept_peaks',
        x: 1080, y: 320
    },
    frozen_lake: {
        id: 'frozen_lake',
        name: 'Frozen Lake',
        description: 'A vast, high-altitude lake, frozen solid. The ice is clear as glass, revealing dark shapes moving in the depths below. It is a dead end.',
        connections: ['summit_approach'],
        activities: [
            { type: 'skilling', id: 'frozen_lake_silver_1', name: 'Mine Silver Vein', skill: SkillName.Mining, requiredLevel: 40, loot: [{ itemId: 'silver_ore', chance: 1, xp: 60 }], resourceCount: { min: 2, max: 4 }, respawnTime: 20000, gatherTime: 4000 }
        ],
        regionId: 'gale_swept_peaks',
        x: 1120, y: 360
    },
    treacherous_ledge: {
        id: 'treacherous_ledge',
        name: 'Treacherous Ledge',
        description: 'A narrow, crumbling ledge that offers a steep shortcut back down the mountain. Watch your step.',
        connections: ['summit_approach', 'goat_trail'],
        activities: [],
        regionId: 'gale_swept_peaks',
        x: 960, y: 260
    },
    the_summit: {
        id: 'the_summit',
        name: 'The Summit',
        description: 'The highest point for miles. The view is breathtaking, but a hulking figure of living stone stands guard over the peak.',
        connections: ['summit_approach', 'ancient_ruins_summit'],
        activities: [
            { type: 'combat', monsterId: 'stone_golem' },
            { type: 'skilling', id: 'summit_adamantite_1', name: 'Mine Adamantite Rock', skill: SkillName.Mining, requiredLevel: 65, loot: [{ itemId: 'adamantite_ore', chance: 1, xp: 120 }], resourceCount: { min: 2, max: 4 }, respawnTime: 45000, gatherTime: 5000 },
            { type: 'skilling', id: 'summit_adamantite_2', name: 'Mine Adamantite Rock', skill: SkillName.Mining, requiredLevel: 65, loot: [{ itemId: 'adamantite_ore', chance: 1, xp: 120 }], resourceCount: { min: 2, max: 4 }, respawnTime: 45000, gatherTime: 5000 },
        ],
        regionId: 'gale_swept_peaks',
        x: 1140, y: 260
    },
    ancient_ruins_summit: {
        id: 'ancient_ruins_summit',
        name: 'Ancient Ruins',
        description: 'The crumbling ruins of a structure of unknown origin. It seems to lead nowhere.',
        connections: ['the_summit'],
        activities: [
            { type: 'skilling', id: 'ancient_ruins_yew_1', name: 'Chop Gnarled Yew', skill: SkillName.Woodcutting, requiredLevel: 65, loot: [{ itemId: 'yew_logs', chance: 1, xp: 175 }], resourceCount: { min: 1, max: 1 }, respawnTime: 75000, gatherTime: 5000 },
            { type: 'skilling', id: 'ancient_ruins_titanium_1', name: 'Mine Titanium Vein', skill: SkillName.Mining, requiredLevel: 75, loot: [{ itemId: 'titanium_ore', chance: 1, xp: 200 }], resourceCount: { min: 1, max: 1 }, respawnTime: 300000, gatherTime: 6000 },
        ],
        regionId: 'gale_swept_peaks',
        x: 1180, y: 220
    },
};