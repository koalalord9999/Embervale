
import { POI, SkillName } from '../../types';
import { CIVILLIAN_DIALOGUE } from '../../constants/dialogue';
import { BROTHER_THADDEUS_DIALOGUE, LIBRARIAN_ANYA_DIALOGUE, INNKEEPER_PHOEBE_DIALOGUE, ARTISAN_KAEL_DIALOGUE, GUARD_CASSIA_DIALOGUE } from '../dialogues/sanctityDialogues';

export const sanctityPois: Record<string, POI> = {
    // --- CONNECTING PATHS ---
    swamp_path_east_1: {
        id: 'swamp_path_east_1',
        name: 'Brackish Path',
        description: 'A muddy path leading east from the lonely cabin, away from the worst of the swamp.',
        connections: ['lonely_cabin', 'swamp_path_east_2'],
        activities: [],
        regionId: 'wilderness',
        x: 1350, y: 1500,
    },
    swamp_path_east_2: {
        id: 'swamp_path_east_2',
        name: 'Dry Ground',
        description: 'The path solidifies here. In the distance, you can see the walls of a small, clean-looking town.',
        connections: ['swamp_path_east_1', 'sanctity_west_gate'],
        activities: [],
        regionId: 'wilderness',
        x: 1450, y: 1500,
    },

    // --- GATES (World Map POIs) ---
    sanctity_west_gate: {
        id: 'sanctity_west_gate',
        name: 'Sanctity West Gate',
        description: 'The western gate of Sanctity, facing the swamps. It is well-maintained and watched by a vigilant guard.',
        connections: ['swamp_path_east_2', 'sanctity_slums'],
        activities: [
            { 
                type: 'npc', 
                name: 'Guard Cassia', 
                icon: '/assets/npcChatHeads/guard_captain_elara.png', 
                dialogue: GUARD_CASSIA_DIALOGUE, 
                startNode: 'start',
                questTopics: ['the_trial_of_war'],
            }
        ],
        regionId: 'sanctity',
        type: 'internal',
        x: 50, y: 250,
        eX: 1650, eY: 1500,
    },
    sanctity_north_gate: {
        id: 'sanctity_north_gate',
        name: 'Sanctity North Gate',
        description: 'The northern gate, leading towards open plains.',
        connections: ['sanctity_north_district', 'sunbright_plains_start'],
        activities: [],
        regionId: 'sanctity',
        type: 'internal',
        x: 250, y: 50,
        eX: 1650, eY: 1500,
    },
    sanctity_east_gate: {
        id: 'sanctity_east_gate',
        name: 'Sanctity East Gate',
        description: 'The eastern gate, facing a grassy field.',
        connections: ['sanctity_east_district', 'wyrmwood_grove_entrance'],
        activities: [],
        regionId: 'sanctity',
        type: 'internal',
        x: 450, y: 250,
        eX: 1650, eY: 1500,
    },
    sanctity_south_gate: {
        id: 'sanctity_south_gate',
        name: 'Sanctity South Gate',
        description: 'The southern gate, leading towards a technologically advanced area.',
        connections: ['sanctity_south_district', 'frostfang_peaks_base'],
        activities: [],
        regionId: 'sanctity',
        type: 'internal',
        x: 250, y: 450,
        eX: 1650, eY: 1500,
    },

    // --- INTERNAL POIs ---
    sanctity_slums: {
        id: 'sanctity_slums',
        name: 'Sanctity Slums',
        description: 'The western part of town has a lingering swampy smell. The houses here are small but tidy.',
        connections: ['sanctity_west_gate', 'sanctity_square'],
        activities: [
            { type: 'thieving_pilfer', id: 'sanctity_house_1', name: 'Locked Shack' },
            { type: 'thieving_pilfer', id: 'sanctity_house_2', name: 'Locked Hovel' },
            { type: 'npc', name: 'Refugee', icon: 'https://api.iconify.design/game-icons:person.svg', dialogue: { start: { npcName: 'Refugee', npcIcon: 'https://api.iconify.design/game-icons:person.svg', text: CIVILLIAN_DIALOGUE.sanctity.join('\n\n'), responses: [] } }, startNode: 'start', dialogueType: 'random' }
        ],
        regionId: 'sanctity',
        x: 150, y: 250, type: 'internal',
    },
    sanctity_square: {
        id: 'sanctity_square',
        name: 'Sanctity Square',
        description: 'The joyous, holy center of Sanctity. A beautiful fountain depicting a serene angel provides clean water.',
        connections: ['sanctity_slums', 'sanctity_north_district', 'sanctity_east_district', 'sanctity_south_district'],
        activities: [
            { type: 'water_source', name: 'Gather from Holy Fountain', isHoly: true },
            { type: 'npc', name: 'Worshipper', icon: 'https://api.iconify.design/game-icons:woman-elf-face.svg', dialogue: { start: { npcName: 'Worshipper', npcIcon: 'https://api.iconify.design/game-icons:woman-elf-face.svg', text: CIVILLIAN_DIALOGUE.sanctity.join('\n\n'), responses: [] } }, startNode: 'start', dialogueType: 'random' },
        ],
        regionId: 'sanctity',
        x: 250, y: 250, type: 'internal',
    },
    sanctity_north_district: {
        id: 'sanctity_north_district',
        name: 'Chapel Road',
        description: 'A pristine road leading north towards the grand chapel and the town library.',
        connections: ['sanctity_square', 'sanctity_chapel', 'sanctity_library', 'sanctity_north_gate'],
        activities: [],
        regionId: 'sanctity',
        x: 250, y: 150, type: 'internal',
    },
    sanctity_east_district: {
        id: 'sanctity_east_district',
        name: 'Pilgrim\'s Path',
        description: 'A grassy path leads east towards the inn and the town gate. There is a sense of foreboding in the air.',
        connections: ['sanctity_square', 'sanctity_inn', 'sanctity_east_gate'],
        activities: [
            { type: 'npc', name: 'Concerned Citizen', icon: 'https://api.iconify.design/game-icons:person.svg', dialogue: { start: { npcName: 'Concerned Citizen', npcIcon: 'https://api.iconify.design/game-icons:person.svg', text: CIVILLIAN_DIALOGUE.sanctity.join('\n\n'), responses: [] } }, startNode: 'start', dialogueType: 'random' }
        ],
        regionId: 'sanctity',
        x: 350, y: 250, type: 'internal',
    },
    sanctity_south_district: {
        id: 'sanctity_south_district',
        name: 'Artisan\'s Way',
        description: 'The southern road is paved with smooth, interlocking stones, leading to the artisan\'s quarter.',
        connections: ['sanctity_square', 'sanctity_artisans_quarter', 'sanctity_south_gate'],
        activities: [],
        regionId: 'sanctity',
        x: 250, y: 350, type: 'internal',
    },
    sanctity_chapel: {
        id: 'sanctity_chapel',
        name: 'Grand Chapel of Sanctity',
        description: 'A large, beautiful chapel dedicated to the gods of light and order.',
        connections: ['sanctity_north_district'],
        activities: [
            { type: 'npc', name: 'Brother Thaddeus', icon: 'https://api.iconify.design/game-icons:priest-hat.svg', dialogue: BROTHER_THADDEUS_DIALOGUE, startNode: 'start', questTopics: ['the_saints_first_step'] },
            {
                type: 'npc',
                name: 'Altar',
                icon: 'https://api.iconify.design/game-icons:altar.svg',
                dialogue: {
                    start: {
                        npcName: 'Altar',
                        npcIcon: 'https://api.iconify.design/game-icons:altar.svg',
                        text: 'You feel a divine presence. Your prayer may be answered here.',
                        responses: [
                            { text: 'Pray', actions: [{ type: 'restore_prayer' }] },
                            { text: 'Leave' }
                        ]
                    }
                },
                startNode: 'start'
            },
            {
                type: 'npc',
                name: 'Reliquary Grinder',
                icon: 'https://api.iconify.design/game-icons:grindstone.svg',
                dialogue: {
                    start: {
                        npcName: 'Reliquary Grinder',
                        npcIcon: 'https://api.iconify.design/game-icons:grindstone.svg',
                        text: 'An old stone grinder used for sacred rituals. Select a bone to grind.',
                        responses: [{ text: "Leave" }],
                        conditionalResponses: [
                            {
                                text: 'Grind Consecrated Bones',
                                check: { requirements: [{ type: 'items', items: [{ itemId: 'consecrated_bones', quantity: 1 }] }], successNode: '', failureNode: '' },
                                actions: [{ type: 'open_make_x_for_grinding', itemId: 'consecrated_bones' }]
                            },
                            {
                                text: 'Grind Consecrated Big Bones',
                                check: { requirements: [{ type: 'items', items: [{ itemId: 'consecrated_big_bones', quantity: 1 }] }], successNode: '', failureNode: '' },
                                actions: [{ type: 'open_make_x_for_grinding', itemId: 'consecrated_big_bones' }]
                            },
                            {
                                text: 'Grind Consecrated Dragon Bones',
                                check: { requirements: [{ type: 'items', items: [{ itemId: 'consecrated_dragon_bones', quantity: 1 }] }], successNode: '', failureNode: '' },
                                actions: [{ type: 'open_make_x_for_grinding', itemId: 'consecrated_dragon_bones' }]
                            }
                        ]
                    }
                },
                startNode: 'start'
            }
        ],
        regionId: 'sanctity',
        x: 200, y: 100, type: 'internal',
    },
    sanctity_library: {
        id: 'sanctity_library',
        name: 'Sanctity Library',
        description: 'A repository of holy texts and historical records.',
        connections: ['sanctity_north_district'],
        activities: [
            { type: 'npc', name: 'Librarian Anya', icon: '/assets/npcChatHeads/librarian_elara.png', dialogue: LIBRARIAN_ANYA_DIALOGUE, startNode: 'start', questTopics: ['the_sorcerers_trial'] }
        ],
        regionId: 'sanctity',
        x: 300, y: 100, type: 'internal',
    },
    sanctity_inn: {
        id: 'sanctity_inn',
        name: 'The Pilgrim\'s Rest',
        description: 'A quiet, clean inn that serves only water and milk. A quest board is posted near the entrance.',
        connections: ['sanctity_east_district'],
        activities: [
            { type: 'quest_board' },
            { type: 'npc', name: 'Innkeeper Phoebe', icon: '/assets/npcChatHeads/barkeep_freya.png', dialogue: INNKEEPER_PHOEBE_DIALOGUE, startNode: 'start' }
        ],
        regionId: 'sanctity',
        x: 400, y: 200, type: 'internal',
    },
    sanctity_artisans_quarter: {
        id: 'sanctity_artisans_quarter',
        name: 'Artisan\'s Quarter',
        description: 'An advanced workshop where technology and faith intersect. Various crafting stations are available.',
        connections: ['sanctity_south_district'],
        activities: [
            { type: 'anvil' },
            { type: 'furnace' },
            { type: 'spinning_wheel' },
            { type: 'npc', name: 'Artisan Kael', icon: '/assets/npcChatHeads/artisan.png', dialogue: ARTISAN_KAEL_DIALOGUE, startNode: 'start' }
        ],
        regionId: 'sanctity',
        x: 200, y: 400, type: 'internal',
    },
};
