import { POI, SkillName } from '../../types';

export const magusSpirePois: Record<string, POI> = {
    magus_spire_entrance: {
        id: 'magus_spire_entrance',
        name: "Magus Spire Entrance",
        description: 'A shimmering, ethereal doorway hangs in the air before the Heartcrystal, leading into a towering spire of pure magic.',
        connections: ['the_heartcrystal', 'ms_f1_landing'],
        activities: [
            {
                type: 'npc',
                name: 'Enter the Spire',
                icon: 'https://api.iconify.design/game-icons:rune-gate.svg',
                questCondition: { questId: 'the_arcane_awakening', stages: [7], visibleAfterCompletion: true },
                startNode: 'enter_spire_start',
            }
        ],
        regionId: 'magus_spire',
        unlockRequirement: { type: 'quest', questId: 'the_arcane_awakening', stage: 7 },
        x: 1954, y: 720,
    },

    // --- FLOOR 1 (5x5 Grid) ---
    // Quadrant: x: 2000-2400, y: 600-1000
    ms_f1_landing: {
        id: 'ms_f1_landing',
        name: 'Spire Antechamber (F1)',
        description: 'You step through the portal into a large, circular room humming with arcane energy. The walls are lined with glowing crystals. A staircase leads back down to the entrance portal.',
        connections: ['magus_spire_entrance', 'ms_f1_hall_south'],
        activities: [
            { type: 'ladder', name: 'Leave Spire', direction: 'down', toPoiId: 'magus_spire_entrance' }
        ],
        regionId: 'magus_spire',
        x: 2200, y: 1000, type: 'internal'
    },
    ms_f1_hall_south: { id: 'ms_f1_hall_south', name: 'Winding Crystal Hall (F1)', description: 'A hallway lined with pulsing crystals.', connections: ['ms_f1_landing', 'ms_f1_hall_west_1'], activities: [{ type: 'combat', monsterId: 'mana_wisp' }], regionId: 'magus_spire', x: 2100, y: 1000, type: 'internal' },
    ms_f1_hall_west_1: {
        id: 'ms_f1_hall_west_1',
        name: 'Winding Crystal Hall (F1)',
        description: 'The crystal hallway continues, bending north.',
        connections: ['ms_f1_hall_south', 'ms_f1_chamber_west', 'ms_f1_hall_west_2'],
        activities: [
            { type: 'combat', monsterId: 'spire_sentry' },
            {
                type: 'agility_shortcut',
                id: 'ms_shortcut_f1_f2',
                name: 'Leap across floating stones (Lvl 72)',
                toPoiId: 'ms_f2_landing',
                level: 72,
                xp: 80,
                baseFailChance: 30,
                failDamage: { min: 5, max: 10 },
                failMessage: "You misjudge the arcane energies and fall.",
                successMessage: "You gracefully navigate the floating stones to the next floor.",
            }
        ],
        regionId: 'magus_spire',
        x: 2100, y: 900, type: 'internal'
    },
    ms_f1_chamber_west: { id: 'ms_f1_chamber_west', name: 'Resonant Chamber (F1)', description: 'A dead-end chamber where the humming of the crystals is noticeably louder.', connections: ['ms_f1_hall_west_1'], activities: [{ type: 'combat', monsterId: 'arcane_familiar' }], regionId: 'magus_spire', x: 2000, y: 900, type: 'internal' },
    ms_f1_hall_west_2: { id: 'ms_f1_hall_west_2', name: 'Winding Crystal Hall (F1)', description: 'The path continues north.', connections: ['ms_f1_hall_west_1', 'ms_f1_central_hall'], activities: [], regionId: 'magus_spire', x: 2200, y: 900, type: 'internal' },
    ms_f1_central_hall: { id: 'ms_f1_central_hall', name: 'Central Hall (F1)', description: 'A central point on this floor, connecting multiple passages.', connections: ['ms_f1_hall_west_2', 'ms_f1_hall_east', 'ms_f1_conjuring_room'], activities: [{ type: 'combat', monsterId: 'lesser_crystal_construct' }], regionId: 'magus_spire', x: 2200, y: 800, type: 'internal' },
    ms_f1_hall_east: { id: 'ms_f1_hall_east', name: 'Winding Crystal Hall (F1)', description: 'A long hallway stretching to the east.', connections: ['ms_f1_central_hall', 'ms_f1_library'], activities: [{ type: 'combat', monsterId: 'mana_wisp' }], regionId: 'magus_spire', x: 2300, y: 800, type: 'internal' },
    ms_f1_library: { id: 'ms_f1_library', name: 'Arcane Library (F1)', description: 'The remains of a once-great library. Scraps of ancient scrolls litter the floor.', connections: ['ms_f1_hall_east'], activities: [{ type: 'combat', monsterId: 'enchanted_tome' }, { type: 'thieving_lockpick', id: 'ms_chest_f1_library', targetName: 'Arcane Lectern', lootTableId: 'thieving_dungeon_chest_high' }], regionId: 'magus_spire', x: 2400, y: 800, type: 'internal' },
    ms_f1_conjuring_room: { id: 'ms_f1_conjuring_room', name: 'Conjuring Room (F1)', description: 'A large, circular diagram is etched into the floor of this room. It pulses with a faint light.', connections: ['ms_f1_central_hall', 'ms_f1_nexus_north'], activities: [{ type: 'combat', monsterId: 'arcane_familiar' }], regionId: 'magus_spire', x: 2200, y: 700, type: 'internal' },
    ms_f1_nexus_north: { id: 'ms_f1_nexus_north', name: 'Northern Nexus (F1)', description: 'The energies of the spire converge here, focused on a glowing staircase leading up.', connections: ['ms_f1_conjuring_room', 'ms_f1_stairwell_up'], activities: [{ type: 'combat', monsterId: 'spire_sentry' }], regionId: 'magus_spire', x: 2300, y: 700, type: 'internal' },
    ms_f1_stairwell_up: { id: 'ms_f1_stairwell_up', name: 'Ascending Staircase (F1)', description: 'A magical staircase spirals upwards into the spire\'s next level.', connections: ['ms_f1_nexus_north', 'ms_f2_landing'], activities: [], regionId: 'magus_spire', x: 2400, y: 700, type: 'internal' },

    // --- FLOOR 2 (5x5 Grid) ---
    // Quadrant: x: 3000-3400, y: 600-1000
    ms_f2_landing: { id: 'ms_f2_landing', name: 'Second Floor Landing (F2)', description: 'You arrive on the second floor. A staircase leads back down.', connections: ['ms_f1_stairwell_up', 'ms_f2_hall_west_1'], activities: [], regionId: 'magus_spire', x: 3400, y: 700, type: 'internal' },
    ms_f2_hall_west_1: { id: 'ms_f2_hall_west_1', name: 'Observation Hall (F2)', description: 'Large, enchanted windows on the outer wall show a swirling view of the cosmos.', connections: ['ms_f2_landing', 'ms_f2_hall_west_2'], activities: [{ type: 'combat', monsterId: 'greater_mana_wisp' }], regionId: 'magus_spire', x: 3300, y: 700, type: 'internal' },
    ms_f2_hall_west_2: { id: 'ms_f2_hall_west_2', name: 'Observation Hall (F2)', description: 'The grand hall continues.', connections: ['ms_f2_hall_west_1', 'ms_f2_golem_foundry', 'ms_f2_central_chamber'], activities: [{ type: 'combat', monsterId: 'runic_guardian' }], regionId: 'magus_spire', x: 3200, y: 700, type: 'internal' },
    ms_f2_golem_foundry: { id: 'ms_f2_golem_foundry', name: 'Golem Foundry (F2)', description: 'This appears to be where the spire\'s guardians were constructed. Tools and crystal fragments litter the floor.', connections: ['ms_f2_hall_west_2'], activities: [{ type: 'combat', monsterId: 'runic_guardian' }, { type: 'thieving_lockpick', id: 'ms_chest_f2_foundry', targetName: 'Construct Component Chest', lootTableId: 'thieving_dungeon_chest_high' }], regionId: 'magus_spire', x: 3200, y: 800, type: 'internal' },
    ms_f2_central_chamber: {
        id: 'ms_f2_central_chamber',
        name: 'Central Chamber (F2)',
        description: 'A large chamber with inactive crystal golems lining the walls.',
        connections: ['ms_f2_hall_west_2', 'ms_f2_hall_south_1'],
        activities: [
            { type: 'combat', monsterId: 'crystalline_spider' },
            {
                type: 'agility_shortcut',
                id: 'ms_shortcut_f2_f3',
                name: 'Leap across floating stones (Lvl 61)',
                toPoiId: 'ms_f3_landing',
                level: 61,
                xp: 70,
                baseFailChance: 40,
                failDamage: { min: 4, max: 8 },
                failMessage: "You lose your footing on a shimmering stone and fall.",
                successMessage: "You skillfully hop across the arcane platforms to the floor above.",
            }
        ],
        regionId: 'magus_spire',
        x: 3200, y: 900, type: 'internal'
    },
    ms_f2_hall_south_1: { id: 'ms_f2_hall_south_1', name: 'Southern Passage (F2)', description: 'A passage leading south.', connections: ['ms_f2_central_chamber', 'ms_f2_hall_south_2'], activities: [{ type: 'combat', monsterId: 'greater_mana_wisp' }], regionId: 'magus_spire', x: 3100, y: 900, type: 'internal' },
    ms_f2_hall_south_2: { id: 'ms_f2_hall_south_2', name: 'Southern Passage (F2)', description: 'The passage bends towards the west.', connections: ['ms_f2_hall_south_1', 'ms_f2_stairwell_up'], activities: [{ type: 'combat', monsterId: 'runic_guardian' }], regionId: 'magus_spire', x: 3100, y: 1000, type: 'internal' },
    ms_f2_stairwell_up: { id: 'ms_f2_stairwell_up', name: 'Ascending Staircase (F2)', description: 'The glowing staircase continues its ascent to the next level.', connections: ['ms_f2_hall_south_2', 'ms_f3_landing'], activities: [], regionId: 'magus_spire', x: 3000, y: 1000, type: 'internal' },

    // --- FLOOR 3 (4x4 Grid) ---
    // Quadrant: x: 4000-4300, y: 700-1000
    ms_f3_landing: { id: 'ms_f3_landing', name: 'Third Floor Landing (F3)', description: 'The magic on this floor feels more potent, almost wild. A staircase leads back down.', connections: ['ms_f2_stairwell_up', 'ms_f3_hall_1'], activities: [], regionId: 'magus_spire', x: 4000, y: 1000, type: 'internal' },
    ms_f3_hall_1: { id: 'ms_f3_hall_1', name: 'Elemental Hall (F3)', description: 'The air shimmers with conflicting elemental energies.', connections: ['ms_f3_landing', 'ms_f3_hall_2'], activities: [{ type: 'combat', monsterId: 'spire_spellweaver' }], regionId: 'magus_spire', x: 4000, y: 900, type: 'internal' },
    ms_f3_hall_2: {
        id: 'ms_f3_hall_2',
        name: 'Elemental Hall (F3)',
        description: 'The path splits here.',
        connections: ['ms_f3_hall_1', 'ms_f3_nexus_west', 'ms_f3_nexus_east'],
        activities: [
            { type: 'combat', monsterId: 'greater_crystal_construct' },
            {
                type: 'agility_shortcut',
                id: 'ms_shortcut_f3_f4',
                name: 'Leap across floating stones (Lvl 55)',
                toPoiId: 'ms_f4_landing',
                level: 55,
                xp: 60,
                baseFailChance: 50,
                failDamage: { min: 3, max: 6 },
                failMessage: "A sudden shift in magical currents causes you to fall.",
                successMessage: "You ride the magical currents between the stones and ascend.",
            }
        ],
        regionId: 'magus_spire',
        x: 4100, y: 900, type: 'internal'
    },
    ms_f3_nexus_west: { id: 'ms_f3_nexus_west', name: 'Nexus of Storms (F3)', description: 'A miniature storm cloud crackles with lightning in the center of this room.', connections: ['ms_f3_hall_2', 'ms_f3_stairwell_up'], activities: [{ type: 'combat', monsterId: 'enchanted_tome' }], regionId: 'magus_spire', x: 4100, y: 800, type: 'internal' },
    ms_f3_nexus_east: { id: 'ms_f3_nexus_east', name: 'Nexus of Flames (F3)', description: 'A pillar of ethereal fire burns brightly in this chamber, giving off no heat.', connections: ['ms_f3_hall_2'], activities: [{ type: 'combat', monsterId: 'spire_spellweaver' }], regionId: 'magus_spire', x: 4200, y: 900, type: 'internal' },
    ms_f3_stairwell_up: { id: 'ms_f3_stairwell_up', name: 'Ascending Staircase (F3)', description: 'The glowing staircase leads higher into the spire.', connections: ['ms_f3_nexus_west', 'ms_f4_landing'], activities: [{ type: 'combat', monsterId: 'greater_crystal_construct' }], regionId: 'magus_spire', x: 4100, y: 700, type: 'internal' },

    // --- FLOOR 4 (4x4 Grid) ---
    // Quadrant: x: 5000-5300, y: 700-1000
    ms_f4_landing: { id: 'ms_f4_landing', name: 'Fourth Floor Landing (F4)', description: 'This floor feels like a place of great power and terrible experiments. A staircase leads back down.', connections: ['ms_f3_stairwell_up', 'ms_f4_guardian_hall'], activities: [], regionId: 'magus_spire', x: 5100, y: 700, type: 'internal' },
    ms_f4_guardian_hall: {
        id: 'ms_f4_guardian_hall',
        name: 'Guardian Hall (F4)',
        description: 'Larger, more intricate crystal guardians stand watch in this long hall.',
        connections: ['ms_f4_landing', 'ms_f4_transmutation_lab', 'ms_f4_hall_1'],
        activities: [
            { type: 'combat', monsterId: 'spire_justicar' },
            {
                type: 'agility_shortcut',
                id: 'ms_shortcut_f4_f5',
                name: 'Leap across floating stones (Lvl 40)',
                toPoiId: 'ms_f5_landing',
                level: 40,
                xp: 50,
                baseFailChance: 60,
                failDamage: { min: 2, max: 5 },
                failMessage: "The path of stones seems unstable. You fall.",
                successMessage: "You confidently leap from stone to stone, reaching the apex.",
            }
        ],
        regionId: 'magus_spire',
        x: 5100, y: 800, type: 'internal'
    },
    ms_f4_transmutation_lab: { id: 'ms_f4_transmutation_lab', name: 'Transmutation Lab (F4)', description: 'Scorched workbenches and shattered vials suggest a powerful magical accident occurred here.', connections: ['ms_f4_guardian_hall'], activities: [{ type: 'combat', monsterId: 'arcane_elemental' }, { type: 'thieving_lockpick', id: 'ms_chest_f4_lab', targetName: "Alchemist's Satchel", lootTableId: 'thieving_dungeon_chest_elite' }], regionId: 'magus_spire', x: 5000, y: 800, type: 'internal' },
    ms_f4_hall_1: { id: 'ms_f4_hall_1', name: 'Summoner\'s Passage (F4)', description: 'Intricate runes cover the walls of this passage.', connections: ['ms_f4_guardian_hall', 'ms_f4_hall_2'], activities: [{ type: 'combat', monsterId: 'spire_justicar' }], regionId: 'magus_spire', x: 5200, y: 800, type: 'internal' },
    ms_f4_hall_2: { id: 'ms_f4_hall_2', name: 'Summoner\'s Passage (F4)', description: 'The passage turns south.', connections: ['ms_f4_hall_1', 'ms_f4_summoning_circle'], activities: [], regionId: 'magus_spire', x: 5200, y: 900, type: 'internal' },
    ms_f4_summoning_circle: { id: 'ms_f4_summoning_circle', name: 'Summoning Circle (F4)', description: 'An intricate circle of runes dominates the floor, still glowing with residual energy.', connections: ['ms_f4_hall_2', 'ms_f4_stairwell_up'], activities: [{ type: 'combat', monsterId: 'arcane_elemental' }], regionId: 'magus_spire', x: 5300, y: 900, type: 'internal' },
    ms_f4_stairwell_up: { id: 'ms_f4_stairwell_up', name: 'Apex Staircase (F4)', description: 'The final staircase, guarded by a powerful creature, leading to the spire\'s apex.', connections: ['ms_f4_summoning_circle', 'ms_f5_landing'], activities: [{ type: 'combat', monsterId: 'crystal_hydra' }], regionId: 'magus_spire', x: 5300, y: 1000, type: 'internal' },

    // --- FLOOR 5 - APEX (3x3 Grid) ---
    // Quadrant: x: 6000-6200, y: 800-1000
    ms_f5_landing: { id: 'ms_f5_landing', name: 'Spire Apex Landing (F5)', description: 'You arrive at the top of the spire. A short path leads to an open-air platform. A staircase leads back down.', connections: ['ms_f4_stairwell_up', 'ms_f5_crossroads'], activities: [], regionId: 'magus_spire', x: 6100, y: 1000, type: 'internal' },
    ms_f5_crossroads: { id: 'ms_f5_crossroads', name: 'Apex Crossroads (F5)', description: 'The path splits, leading to the west and east sides of the apex.', connections: ['ms_f5_landing', 'ms_f5_wyvern_roost', 'ms_f5_challenge_chamber'], activities: [
        {
                type: 'npc',
                name: 'Slumped Adventurer',
                icon: 'https://api.iconify.design/game-icons:dead-head.svg',
                pickpocket: { lootTableId: 'pickpocket_adventurer_table' },
                dialogue: {
                    main: {
                        npcName: 'Slumped Adventurer',
                        npcIcon: 'https://api.iconify.design/game-icons:dead-head.svg',
                        text: "The adventurer is slumped against the wall, clearly deceased. Their shield seems to be radiating a faint warmth.",
                        responses: [ { text: "Leave them be." } ],
                        conditionalResponses: [
                            {
                                text: "(Take the Mysterious Shield)",
                                check: {
                                    requirements: [{ type: 'items', items: [{ itemId: 'fire_resistant_shield', quantity: 0, operator: 'eq' }] }],
                                    successNode: 'shield_taken',
                                    failureNode: '' // Unused
                                },
                                actions: [{ type: 'give_item', itemId: 'fire_resistant_shield', quantity: 1 }]
                            }
                        ]
                    },
                    shield_taken: {
                        npcName: 'Slumped Adventurer',
                        npcIcon: 'https://api.iconify.design/game-icons:dead-head.svg',
                        text: "You take the shield. It feels surprisingly light. You have already taken what you can.",
                        responses: []
                    }
                },
                startNode: 'main'
            }
    ], regionId: 'magus_spire', x: 6100, y: 900, type: 'internal' },
    ms_f5_challenge_chamber: { id: 'ms_f5_challenge_chamber', name: 'Challenge Chamber (F5)', description: 'A dead-end chamber filled with the spire\'s most powerful guardians.', connections: ['ms_f5_crossroads'], activities: [{ type: 'combat', monsterId: 'spire_justicar' }, { type: 'combat', monsterId: 'spire_justicar' }, { type: 'combat', monsterId: 'arcane_elemental' }], regionId: 'magus_spire', x: 6200, y: 900, type: 'internal' },
    ms_f5_wyvern_roost: { id: 'ms_f5_wyvern_roost', name: 'Wyvern\'s Roost (F5)', description: 'The apex of the spire, open to the swirling cosmos. A massive arcane wyvern guards a floating altar further on.', connections: ['ms_f5_crossroads', 'ms_f5_astral_altar'], activities: [{ type: 'combat', monsterId: 'arcane_wyvern' }], regionId: 'magus_spire', x: 6000, y: 900, type: 'internal' },
    ms_f5_astral_altar: {
        id: 'ms_f5_astral_altar',
        name: 'Astral Altar',
        description: 'Just beyond the wyvern is a cosmically charged altar. A teleport pad offers a quick exit.',
        connections: ['ms_f5_wyvern_roost'],
        activities: [
            { type: 'runecrafting_altar', runeId: 'astral_rune' },
            { type: 'ladder', name: 'Telepad to Entrance', direction: 'down', toPoiId: 'magus_spire_entrance' }
        ],
        regionId: 'magus_spire',
        x: 6000, y: 800, type: 'internal'
    },
};