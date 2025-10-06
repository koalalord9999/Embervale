
import { POI, SkillName } from '../../types';

export const magusSpirePois: Record<string, POI> = {
    // Floor 1
    ms_f1_antechamber: {
        id: 'ms_f1_antechamber',
        name: 'Spire Antechamber',
        description: 'You step into a circular room humming with arcane energy. The walls are lined with glowing crystals. Paths lead to the west and east, with a larger chamber to the north.',
        connections: ['magus_spire_entrance', 'ms_f1_west_hall', 'ms_f1_east_hall', 'ms_f1_central_chamber'],
        activities: [],
        regionId: 'magus_spire',
        unlockRequirement: { type: 'quest', questId: 'the_arcane_awakening', stage: 8 },
        x: 1954, y: 680,
    },
    ms_f1_west_hall: {
        id: 'ms_f1_west_hall',
        name: 'West Hall of Warding',
        description: 'This hall is inscribed with dormant protective wards.',
        connections: ['ms_f1_antechamber', 'ms_f1_conjuring_room'],
        activities: [
            { type: 'combat', monsterId: 'mana_wisp' },
        ],
        regionId: 'magus_spire',
        x: 1900, y: 680,
    },
    ms_f1_east_hall: {
        id: 'ms_f1_east_hall',
        name: 'East Hall of Tomes',
        description: 'Empty bookshelves line the walls, their contents long since turned to dust.',
        connections: ['ms_f1_antechamber', 'ms_f1_library'],
        activities: [
            { type: 'combat', monsterId: 'mana_wisp' },
        ],
        regionId: 'magus_spire',
        x: 2008, y: 680,
    },
    ms_f1_conjuring_room: {
        id: 'ms_f1_conjuring_room',
        name: 'Conjuring Room',
        description: 'A large, circular diagram is etched into the floor of this room. It pulses with a faint light.',
        connections: ['ms_f1_west_hall'],
        activities: [
            { type: 'combat', monsterId: 'arcane_familiar' },
        ],
        regionId: 'magus_spire',
        x: 1860, y: 680,
    },
    ms_f1_library: {
        id: 'ms_f1_library',
        name: 'Arcane Library',
        description: 'The remains of a once-great library. Scraps of ancient scrolls litter the floor.',
        connections: ['ms_f1_east_hall'],
        activities: [
            { type: 'combat', monsterId: 'arcane_familiar' },
            { type: 'combat', monsterId: 'spire_sentry' },
        ],
        regionId: 'magus_spire',
        x: 2048, y: 680,
    },
    ms_f1_central_chamber: {
        id: 'ms_f1_central_chamber',
        name: 'First Floor Hub',
        description: 'A central chamber connecting the various parts of this floor. A glowing staircase leads upwards.',
        connections: ['ms_f1_antechamber', 'ms_f1_stairwell'],
        activities: [
            { type: 'combat', monsterId: 'lesser_crystal_construct' },
        ],
        regionId: 'magus_spire',
        x: 1954, y: 640,
    },
    ms_f1_stairwell: {
        id: 'ms_f1_stairwell',
        name: 'Ascending Staircase',
        description: 'A magical staircase spirals upwards into the spire\'s next level.',
        connections: ['ms_f1_central_chamber'],
        activities: [
            { type: 'ladder', name: 'Climb Up', direction: 'up', toPoiId: 'ms_f2_landing' },
            { type: 'combat', monsterId: 'spire_sentry' },
        ],
        regionId: 'magus_spire',
        x: 1954, y: 600,
    },

    // Floor 2
    ms_f2_landing: {
        id: 'ms_f2_landing',
        name: 'Second Floor Landing',
        description: 'You arrive on the second floor. The air is thick with arcane energy. A staircase leads back down.',
        connections: ['ms_f2_north_chamber', 'ms_f2_south_chamber'],
        activities: [
            { type: 'ladder', name: 'Go Down', direction: 'down', toPoiId: 'ms_f1_stairwell' },
        ],
        regionId: 'magus_spire',
        x: 1954, y: 600,
    },
    ms_f2_north_chamber: {
        id: 'ms_f2_north_chamber',
        name: 'Chamber of Observation',
        description: 'A large, enchanted window on the northern wall shows a swirling view of the cosmos.',
        connections: ['ms_f2_landing', 'ms_f2_stairwell'],
        activities: [
            { type: 'combat', monsterId: 'greater_mana_wisp' },
            { type: 'combat', monsterId: 'greater_mana_wisp' },
        ],
        regionId: 'magus_spire',
        x: 1954, y: 560,
    },
    ms_f2_south_chamber: {
        id: 'ms_f2_south_chamber',
        name: 'Chamber of Constructs',
        description: 'Inactive crystal golems line the walls of this chamber, their facets dimly glowing.',
        connections: ['ms_f2_landing', 'ms_f2_golem_foundry'],
        activities: [
            { type: 'combat', monsterId: 'runic_guardian' },
        ],
        regionId: 'magus_spire',
        x: 1954, y: 640,
    },
    ms_f2_golem_foundry: {
        id: 'ms_f2_golem_foundry',
        name: 'Golem Foundry',
        description: 'This appears to be where the spire\'s guardians were constructed. Tools and crystal fragments litter the floor.',
        connections: ['ms_f2_south_chamber'],
        activities: [
            { type: 'combat', monsterId: 'crystalline_spider' },
            { type: 'combat', monsterId: 'runic_guardian' },
        ],
        regionId: 'magus_spire',
        x: 1954, y: 680,
    },
    ms_f2_stairwell: {
        id: 'ms_f2_stairwell',
        name: 'Ascending Staircase',
        description: 'The glowing staircase continues its ascent to the next level.',
        connections: ['ms_f2_north_chamber'],
        activities: [
            { type: 'ladder', name: 'Climb Up', direction: 'up', toPoiId: 'ms_f3_landing' },
            { type: 'combat', monsterId: 'crystalline_spider' },
        ],
        regionId: 'magus_spire',
        x: 1954, y: 520,
    },

    // Floor 3
    ms_f3_landing: {
        id: 'ms_f3_landing',
        name: 'Third Floor Landing',
        description: 'The magic on this floor feels more potent, almost wild. A staircase leads back down.',
        connections: ['ms_f3_crossroads'],
        activities: [
            { type: 'ladder', name: 'Go Down', direction: 'down', toPoiId: 'ms_f2_stairwell' },
        ],
        regionId: 'magus_spire',
        x: 1954, y: 520,
    },
    ms_f3_crossroads: {
        id: 'ms_f3_crossroads',
        name: 'Elemental Crossroads',
        description: 'This central chamber splits into three paths. The air shimmers with conflicting elemental energies.',
        connections: ['ms_f3_landing', 'ms_f3_elemental_nexus_west', 'ms_f3_elemental_nexus_east', 'ms_f3_stairwell'],
        activities: [
            { type: 'combat', monsterId: 'greater_crystal_construct' },
        ],
        regionId: 'magus_spire',
        x: 1954, y: 480,
    },
    ms_f3_elemental_nexus_west: {
        id: 'ms_f3_elemental_nexus_west',
        name: 'Nexus of Storms',
        description: 'A miniature storm cloud crackles with lightning in the center of this room.',
        connections: ['ms_f3_crossroads'],
        activities: [
            { type: 'combat', monsterId: 'enchanted_tome' },
            { type: 'combat', monsterId: 'spire_spellweaver' },
        ],
        regionId: 'magus_spire',
        x: 1900, y: 480,
    },
    ms_f3_elemental_nexus_east: {
        id: 'ms_f3_elemental_nexus_east',
        name: 'Nexus of Flames',
        description: 'A pillar of ethereal fire burns brightly in this chamber, giving off no heat.',
        connections: ['ms_f3_crossroads'],
        activities: [
            { type: 'combat', monsterId: 'enchanted_tome' },
            { type: 'combat', monsterId: 'spire_spellweaver' },
        ],
        regionId: 'magus_spire',
        x: 2008, y: 480,
    },
    ms_f3_stairwell: {
        id: 'ms_f3_stairwell',
        name: 'Ascending Staircase',
        description: 'The glowing staircase leads higher into the spire.',
        connections: ['ms_f3_crossroads'],
        activities: [
            { type: 'ladder', name: 'Climb Up', direction: 'up', toPoiId: 'ms_f4_landing' },
            { type: 'combat', monsterId: 'greater_crystal_construct' },
        ],
        regionId: 'magus_spire',
        x: 1954, y: 440,
    },

    // Floor 4
    ms_f4_landing: {
        id: 'ms_f4_landing',
        name: 'Fourth Floor Landing',
        description: 'This floor feels like a place of great power and terrible experiments. A staircase leads back down.',
        connections: ['ms_f4_guardian_hall'],
        activities: [
            { type: 'ladder', name: 'Go Down', direction: 'down', toPoiId: 'ms_f3_stairwell' },
        ],
        regionId: 'magus_spire',
        x: 1954, y: 440,
    },
    ms_f4_guardian_hall: {
        id: 'ms_f4_guardian_hall',
        name: 'Guardian Hall',
        description: 'Larger, more intricate crystal guardians stand watch in this long hall.',
        connections: ['ms_f4_landing', 'ms_f4_transmutation_lab', 'ms_f4_summoning_circle', 'ms_f4_stairwell'],
        activities: [
            { type: 'combat', monsterId: 'spire_justicar' },
            { type: 'combat', monsterId: 'spire_justicar' },
        ],
        regionId: 'magus_spire',
        x: 1954, y: 400,
    },
    ms_f4_transmutation_lab: {
        id: 'ms_f4_transmutation_lab',
        name: 'Transmutation Lab',
        description: 'Scorched workbenches and shattered vials suggest a powerful magical accident occurred here.',
        connections: ['ms_f4_guardian_hall'],
        activities: [
            { type: 'combat', monsterId: 'arcane_elemental' },
        ],
        regionId: 'magus_spire',
        x: 1900, y: 400,
    },
    ms_f4_summoning_circle: {
        id: 'ms_f4_summoning_circle',
        name: 'Summoning Circle',
        description: 'An intricate circle of runes dominates the floor, still glowing with residual energy.',
        connections: ['ms_f4_guardian_hall'],
        activities: [
            { type: 'combat', monsterId: 'arcane_elemental' },
            { type: 'combat', monsterId: 'spire_justicar' },
        ],
        regionId: 'magus_spire',
        x: 2008, y: 400,
    },
    ms_f4_stairwell: {
        id: 'ms_f4_stairwell',
        name: 'Apex Staircase',
        description: 'The final staircase, leading to the spire\'s apex.',
        connections: ['ms_f4_guardian_hall'],
        activities: [
            { type: 'ladder', name: 'Climb to Apex', direction: 'up', toPoiId: 'ms_f5_landing' },
            { type: 'combat', monsterId: 'crystal_hydra' },
        ],
        regionId: 'magus_spire',
        x: 1954, y: 360,
    },

    // Floor 5
    ms_f5_landing: {
        id: 'ms_f5_landing',
        name: 'Spire Apex Landing',
        description: 'You arrive at the top of the spire. A short path leads to an open-air platform. A staircase leads back down. The body of an adventurer is slumped against the wall.',
        connections: ['ms_f5_final_approach'],
        activities: [
            { type: 'ladder', name: 'Go Down', direction: 'down', toPoiId: 'ms_f4_stairwell' },
            {
                type: 'npc',
                name: 'Slumped Adventurer',
                icon: 'https://api.iconify.design/game-icons:dead-head.svg',
                dialogue: {
                    start: {
                        npcName: 'Slumped Adventurer',
                        npcIcon: 'https://api.iconify.design/game-icons:dead-head.svg',
                        text: "The adventurer is slumped against the wall, clearly deceased. Their shield seems to be radiating a faint warmth.",
                        responses: [
                            { text: "(Take the Mysterious Shield)", actions: [{ type: 'give_item', itemId: 'fire_resistant_shield', quantity: 1 }] }
                        ]
                    }
                },
                startNode: 'start'
            }
        ],
        regionId: 'magus_spire',
        x: 1954, y: 360,
    },
    ms_f5_final_approach: {
        id: 'ms_f5_final_approach',
        name: 'Final Approach',
        description: 'A narrow walkway of pure crystal leads to the center of the apex platform.',
        connections: ['ms_f5_landing', 'ms_f5_wyvern_roost'],
        activities: [],
        regionId: 'magus_spire',
        x: 1954, y: 320,
    },
    ms_f5_wyvern_roost: {
        id: 'ms_f5_wyvern_roost',
        name: 'Wyvern\'s Roost',
        description: 'The apex of the spire, open to the swirling cosmos. A massive arcane wyvern guards a floating altar.',
        connections: ['ms_f5_final_approach'],
        activities: [
            { type: 'runecrafting_altar', runeId: 'astral_rune' },
            { type: 'combat', monsterId: 'arcane_wyvern' },
        ],
        regionId: 'magus_spire',
        x: 1954, y: 280,
    },
};
