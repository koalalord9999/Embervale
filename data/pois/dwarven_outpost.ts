
import { POI, SkillName } from '../../types';

export const dwarvenOutpostPois: Record<string, POI> = {
    dwarven_outpost_entrance: {
        id: 'dwarven_outpost_entrance',
        name: 'Dwarven Outpost Entrance',
        description: 'A sturdy, stone archway reinforced with thick wooden beams leads into a small dwarven settlement. The air smells of coal smoke and roasted meat.',
        connections: ['mine_depths', 'dwarven_forge'],
        activities: [],
        regionId: 'wilderness',
        x: 1400, y: 1200,
        cityMapX: 250, cityMapY: 450,
    },
    dwarven_forge: {
        id: 'dwarven_forge',
        name: 'Dwarven Forge',
        description: 'A small but well-kept forge. A bearded dwarf with soot on his face tends to the flames, offering a selection of fine pickaxes.',
        connections: ['dwarven_outpost_entrance', 'outpost_mine'],
        activities: [
            { type: 'shop', shopId: 'dwarven_pickaxes' },
            {
                type: 'npc',
                name: 'Durin',
                icon: '/assets/npcChatHeads/prospector_gudrun.png',
                dialogue: {
                    start: {
                        npcName: 'Durin',
                        npcIcon: '/assets/npcChatHeads/prospector_gudrun.png',
                        text: "Best pickaxes this side of the mountain, guaranteed!",
                        responses: [
                             { text: "Just looking around." }
                        ],
                        conditionalResponses: [
                            { text: "I was told you could build a 'Resonance Dampener'.", check: { requirements: [{type: 'quest', questId: 'the_arcane_awakening', status: 'in_progress', stage: 3}], successNode: 'quest_intro_resonance_dampener', failureNode: ''}},
                            { text: "About that Resonance Dampener...", check: { requirements: [{type: 'quest', questId: 'the_arcane_awakening', status: 'in_progress', stage: 4}], successNode: 'in_progress_the_arcane_awakening_4', failureNode: ''}},
                            { text: "I have the materials you asked for.", check: { requirements: [{type: 'quest', questId: 'the_arcane_awakening', status: 'in_progress', stage: 5}, { type: 'items', items: [{ itemId: 'golem_core', quantity: 5 }, { itemId: 'runic_bar', quantity: 10 }, { itemId: 'eldritch_pearl', quantity: 1 }] }], successNode: 'in_progress_the_arcane_awakening_5', failureNode: 'in_progress_the_arcane_awakening_4'}},
                        ]
                    },
                    quest_intro_resonance_dampener: {
                        npcName: 'Durin',
                        npcIcon: '/assets/npcChatHeads/prospector_gudrun.png',
                        text: "A 'Resonance Dampener'? Hah! More floaty magic nonsense. Still... the engineering challenge is intriguing. Aye, I can build it. But it won't be easy, and it won't be cheap. The materials required are exceptionally rare.",
                        responses: [
                            { text: "What do you need?", next: 'taa_durin_2' }
                        ]
                    },
                    taa_durin_2: {
                        npcName: 'Durin',
                        npcIcon: '/assets/npcChatHeads/prospector_gudrun.png',
                        text: "For the core's stability, I'll need 5 Golem Cores from the Stone Golems in the Gale-Swept Peaks. For the casing, 10 Runic Bars—smith them yourself if you have the skill, or find someone who can. And for the dampening agent... an Eldritch Pearl from the Shipwreck Specters on the Isle of Whispers. Bring me these things, and I'll build your contraption.",
                        responses: [
                            { text: "It's a tall order, but I'll get them.", actions: [{ type: 'advance_quest', questId: 'the_arcane_awakening' }] }
                        ]
                    },
                    in_progress_the_arcane_awakening_4: {
                        npcName: 'Durin',
                        npcIcon: '/assets/npcChatHeads/prospector_gudrun.png',
                        text: "Still gathering the materials? They won't find themselves, you know. 5 Golem Cores, 10 Runic Bars, and 1 Eldritch Pearl. Get to it.",
                        responses: []
                    },
                    in_progress_the_arcane_awakening_5: {
                        npcName: 'Durin',
                        npcIcon: '/assets/npcChatHeads/prospector_gudrun.png',
                        text: "You've got them! By my beard, you actually did it. Give them here. ... A bit of hammering, a touch of riveting... and... done! One Resonance Dampener, as ordered. Now take this thing and get it out of my forge. It's making my anvil nervous.",
                        responses: [
                            { text: "Thank you, Durin. This is incredible work.", actions: [{ type: 'take_item', itemId: 'golem_core', quantity: 5 }, { type: 'take_item', itemId: 'runic_bar', quantity: 10 }, { type: 'take_item', itemId: 'eldritch_pearl', quantity: 1 }, { type: 'give_item', itemId: 'resonance_dampener', quantity: 1 }, { type: 'advance_quest', questId: 'the_arcane_awakening' }] }
                        ]
                    }
                },
                startNode: 'start',
            }
        ],
        regionId: 'dwarven_outpost',
        x: 250, y: 300,
        type: 'internal',
    },
    outpost_mine: {
        id: 'outpost_mine',
        name: 'Outpost Mine',
        description: 'A small, rich vein of minerals the dwarves are excavating. It seems they\'ve found a good spot.',
        connections: ['dwarven_forge'],
        activities: [
            { type: 'skilling', id: 'outpost_large_copper_1', name: 'Mine Large Copper Vein', skill: SkillName.Mining, requiredLevel: 15, loot: [{ itemId: 'copper_ore', chance: 1, xp: 18 }], resourceCount: { min: 4, max: 10 }, respawnTime: 15000, gatherTime: 2500, harvestBoost: 10 },
            { type: 'skilling', id: 'outpost_large_tin_1', name: 'Mine Large Tin Vein', skill: SkillName.Mining, requiredLevel: 15, loot: [{ itemId: 'tin_ore', chance: 1, xp: 18 }], resourceCount: { min: 4, max: 10 }, respawnTime: 15000, gatherTime: 2500, harvestBoost: 10 },
            { type: 'skilling', id: 'outpost_large_iron_1', name: 'Mine Large Iron Vein', skill: SkillName.Mining, requiredLevel: 30, loot: [{ itemId: 'iron_ore', chance: 1, xp: 35 }], resourceCount: { min: 4, max: 10 }, respawnTime: 20000, gatherTime: 3000, harvestBoost: 10 },
            { type: 'skilling', id: 'outpost_large_iron_2', name: 'Mine Large Iron Vein', skill: SkillName.Mining, requiredLevel: 30, loot: [{ itemId: 'iron_ore', chance: 1, xp: 35 }], resourceCount: { min: 4, max: 10 }, respawnTime: 20000, gatherTime: 3000, harvestBoost: 10 },
            { type: 'skilling', id: 'outpost_large_coal_1', name: 'Mine Large Coal Vein', skill: SkillName.Mining, requiredLevel: 45, loot: [{ itemId: 'coal', chance: 1, xp: 50 }], resourceCount: { min: 4, max: 10 }, respawnTime: 25000, gatherTime: 3500, harvestBoost: 10 },
            { type: 'skilling', id: 'outpost_large_coal_2', name: 'Mine Large Coal Vein', skill: SkillName.Mining, requiredLevel: 45, loot: [{ itemId: 'coal', chance: 1, xp: 50 }], resourceCount: { min: 4, max: 10 }, respawnTime: 25000, gatherTime: 3500, harvestBoost: 10 },
            { type: 'skilling', id: 'outpost_large_coal_3', name: 'Mine Large Coal Vein', skill: SkillName.Mining, requiredLevel: 45, loot: [{ itemId: 'coal', chance: 1, xp: 50 }], resourceCount: { min: 4, max: 10 }, respawnTime: 25000, gatherTime: 3500, harvestBoost: 10 },
        ],
        regionId: 'dwarven_outpost',
        x: 250, y: 150,
        type: 'internal',
    },
};
