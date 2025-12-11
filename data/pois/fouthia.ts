
import { POI, SkillName } from '../../types';
import { CIVILLIAN_DIALOGUE } from '../../constants/dialogue';
import { BANKER_ZAHRA_DIALOGUE, BARKEEP_ZALE_DIALOGUE, KHALID_DIALOGUE, ZAFIRA_DIALOGUE, CAPTAIN_OMAR_DIALOGUE } from '../dialogues/fouthiaDialogues';

export const fouthiaPois: Record<string, POI> = {
    // --- GATES (World Map POIs) ---
        fouthia_north_gate: {
        id: 'fouthia_north_gate',
        name: 'Fouthia North Gate',
        description: 'This gate looks towards a range of dark, volcanic mountains. A hot wind blows from the north.',
        connections: ['fouthia_garrison_road', 'vsv_entrance'],
        activities: [
            { type: 'npc', name: 'Fouthian Guard', icon: 'https://api.iconify.design/game-icons:desert-helmet.svg', attackableMonsterId: 'fouthian_guard' }
        ],
        regionId: 'fouthia',
        type: 'internal',
        x: 250,
        y: 50,
        eX: -42,
        eY: 1256,
    },
        fouthia_southeast_gate: {
        id: 'fouthia_southeast_gate',
        name: 'Fouthia South-East Gate',
        description: 'A gate of sun-bleached wood and rusted iron, leading out into the blinding Salt Flats.',
        connections: ['salt_flats_northwest_passage', 'fouthia_main_street'],
        activities: [
            { type: 'npc', name: 'Fouthian Guard', icon: 'https://api.iconify.design/game-icons:desert-helmet.svg', attackableMonsterId: 'fouthian_guard' }
        ],
        regionId: 'fouthia',
        type: 'internal',
        x: 450,
        y: 450,
        eX: -42,
        eY: 1256,
    },
        fouthia_west_gate: {
        id: 'fouthia_west_gate',
        name: 'Fouthia West Gate',
        description: 'The western gate opens to a vast, shimmering desert, said to hide the ruins of a Sunken City.',
        connections: ['fouthia_back_alleys', 'sunscorched_wastes_entrance'],
        activities: [
            { type: 'npc', name: 'Fouthian Guard', icon: 'https://api.iconify.design/game-icons:desert-helmet.svg', attackableMonsterId: 'fouthian_guard' }
        ],
        regionId: 'fouthia',
        type: 'internal',
        x: 50,
        y: 250,
        eX: -42,
        eY: 1256,
    },

    // --- INTERNAL POIs ---
    fouthia_main_street: {
        id: 'fouthia_main_street',
        name: 'Main Street',
        description: 'The dusty main street leading from the gate to the town square. Buildings are made of sandstone and weathered wood.',
        connections: ['fouthia_southeast_gate', 'fouthia_square'],
        activities: [
            { type: 'npc', name: 'Weary Traveler', icon: 'https://api.iconify.design/game-icons:person.svg', dialogue: { start: { npcName: 'Weary Traveler', npcIcon: 'https://api.iconify.design/game-icons:person.svg', text: CIVILLIAN_DIALOGUE.fouthia.join('\n\n'), responses: [] } }, startNode: 'start', dialogueType: 'random', attackableMonsterId: 'man', pickpocket: { lootTableId: 'pickpocket_man_woman_table' } },
        ],
        regionId: 'fouthia',
        x: 350, y: 350, type: 'internal',
    },
    fouthia_square: {
        id: 'fouthia_square',
        name: 'Fouthia Square',
        description: 'The heart of the town, centered around a deep stone well. It is surprisingly busy, a hub of activity in the desolate wastes.',
        connections: ['fouthia_main_street', 'fouthia_bazaar', 'fouthia_garrison_road', 'fouthia_back_alleys', 'fouthia_bank', 'fouthia_general_store', 'fouthia_shrine'],
        activities: [
            { type: 'water_source', name: 'Draw Water from Well' },
            { type: 'npc', name: 'Townsfolk', icon: 'https://api.iconify.design/game-icons:woman-elf-face.svg', dialogue: { start: { npcName: 'Townsfolk', npcIcon: 'https://api.iconify.design/game-icons:woman-elf-face.svg', text: CIVILLIAN_DIALOGUE.fouthia.join('\n\n'), responses: [] } }, startNode: 'start', dialogueType: 'random', attackableMonsterId: 'woman', pickpocket: { lootTableId: 'pickpocket_man_woman_table' } },
        ],
        regionId: 'fouthia',
        x: 250, y: 250, type: 'internal',
    },
    fouthia_shrine: {
        id: 'fouthia_shrine',
        name: 'Desert Shrine',
        description: 'A small, humble shrine made of sandstone, dedicated to the spirits of the desert.',
        connections: ['fouthia_square'],
        activities: [
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
            }
        ],
        regionId: 'fouthia',
        x: 200, y: 200, type: 'internal',
    },
    fouthia_bazaar: {
        id: 'fouthia_bazaar',
        name: 'The Bazaar',
        description: 'A crowded, open-air market where merchants hawk exotic goods from beneath canvas awnings.',
        connections: ['fouthia_square', 'the_sand_serpent_inn'],
        activities: [
            { type: 'thieving_stall', id: 'fouthia_bazaar_water_stall', name: 'Steal from Water Stall', lootTableId: 'thieving_stall_water' },
            { type: 'thieving_stall', id: 'fouthia_bazaar_spice_stall', name: 'Steal from Spice Stall', lootTableId: 'thieving_stall_spices' },
            { type: 'npc', name: 'Merchant', icon: '/assets/npcChatHeads/merchant_theron.png', dialogue: { start: { npcName: 'Merchant', npcIcon: '/assets/npcChatHeads/merchant_theron.png', text: CIVILLIAN_DIALOGUE.fouthia.join('\n\n'), responses: [] } }, startNode: 'start', dialogueType: 'random', pickpocket: { lootTableId: 'pickpocket_merchant_table' } },
        ],
        regionId: 'fouthia',
        x: 350, y: 250, type: 'internal',
    },
    fouthia_garrison_road: {
        id: 'fouthia_garrison_road',
        name: 'Garrison Road',
        description: 'The road leading to the north gate and the town barracks. The guards here look particularly on edge.',
        connections: ['fouthia_square', 'fouthia_north_gate', 'fouthia_barracks'],
        activities: [],
        regionId: 'fouthia',
        x: 250, y: 150, type: 'internal',
    },
    fouthia_back_alleys: {
        id: 'fouthia_back_alleys',
        name: 'Back Alleys',
        description: 'A maze of narrow, sandy alleys. A good place to find trouble, or avoid it.',
        connections: ['fouthia_square', 'fouthia_west_gate', 'fouthia_armorer', 'fouthia_alchemist', 'fouthia_rooftop_access'],
        activities: [
            { type: 'thieving_pilfer', id: 'fouthia_house_1', name: 'Locked House' },
            { type: 'thieving_pilfer', id: 'fouthia_house_2', name: 'Locked House' },
            { type: 'ground_item', id: 'fouthia_alleys_knife', itemId: 'knife', resourceCount: 1, respawnTimer: 300000 },
        ],
        regionId: 'fouthia',
        x: 150, y: 250, type: 'internal',
    },
    fouthia_bank: {
        id: 'fouthia_bank',
        name: 'Bank of Embrune',
        description: 'A fortified sandstone building. Your items are safe from bandits and sandstorms here.',
        connections: ['fouthia_square'],
        activities: [
            {
                type: 'npc',
                name: 'Banker Zahra',
                icon: '/assets/npcChatHeads/banker_astrid.png',
                actions: [
                    { label: 'Bank', action: 'open_bank' },
                    { label: 'Deposit Backpack', action: 'deposit_backpack' },
                    { label: 'Deposit Equipment', action: 'deposit_equipment' },
                ],
                dialogue: BANKER_ZAHRA_DIALOGUE,
                startNode: 'start'
            }
        ],
        regionId: 'fouthia',
        x: 200, y: 300, type: 'internal',
    },
    fouthia_general_store: {
        id: 'fouthia_general_store',
        name: 'Wanderer\'s Wares',
        description: 'A general store catering to desert travelers, selling waterskins, tools, and basic supplies.',
        connections: ['fouthia_square'],
        activities: [{ type: 'shop', shopId: 'fouthia_general' }],
        regionId: 'fouthia',
        x: 300, y: 200, type: 'internal',
    },
    the_sand_serpent_inn: {
        id: 'the_sand_serpent_inn',
        name: 'The Sand Serpent Inn',
        description: 'A shady-looking inn, popular with mercenaries and travelers with loose morals.',
        connections: ['fouthia_bazaar'],
        activities: [
            { type: 'quest_board' },
            { type: 'npc', name: 'Barkeep Zale', icon: '/assets/npcChatHeads/barkeep_grimley.png', dialogue: BARKEEP_ZALE_DIALOGUE, startNode: 'start' }
        ],
        regionId: 'fouthia',
        x: 400, y: 250, type: 'internal',
    },
    fouthia_barracks: {
        id: 'fouthia_barracks',
        name: 'Fouthia Barracks',
        description: 'A small, functional barracks. The few guards here seem overworked and weary.',
        connections: ['fouthia_garrison_road'],
        activities: [
            { type: 'npc', name: 'Captain Omar', icon: '/assets/npcChatHeads/guard_captain_elara.png', dialogue: CAPTAIN_OMAR_DIALOGUE, startNode: 'start' }
        ],
        regionId: 'fouthia',
        x: 200, y: 150, type: 'internal',
    },
    fouthia_armorer: {
        id: 'fouthia_armorer',
        name: 'Desert Armorer',
        description: 'A smithy specializing in lighter armor suitable for the heat. The forge burns day and night.',
        connections: ['fouthia_back_alleys'],
        activities: [
            { type: 'shop', shopId: 'fouthia_armorer' },
            { type: 'furnace' },
            { type: 'anvil' },
            { type: 'npc', name: 'Khalid the Armorer', icon: '/assets/npcChatHeads/valerius_the_master_smith.png', dialogue: KHALID_DIALOGUE, startNode: 'start' },
        ],
        regionId: 'fouthia',
        x: 100, y: 200, type: 'internal',
    },
    fouthia_alchemist: {
        id: 'fouthia_alchemist',
        name: 'Zafira\'s Remedies',
        description: 'A small shop filled with the scent of strange desert herbs and bubbling concoctions.',
        connections: ['fouthia_back_alleys'],
        activities: [
            { type: 'shop', shopId: 'fouthia_alchemist' },
            { type: 'npc', name: 'Zafira the Alchemist', icon: '/assets/npcChatHeads/herbalist_anise.png', dialogue: ZAFIRA_DIALOGUE, startNode: 'start' }
        ],
        regionId: 'fouthia',
        x: 100, y: 300, type: 'internal',
    },
    fouthia_rooftop_access: {
        id: 'fouthia_rooftop_access',
        name: 'Rooftop Access',
        description: 'A rickety ladder leans against a sandstone wall, leading up to the sun-baked rooftops.',
        connections: ['fouthia_back_alleys'],
        activities: [
            { type: 'start_agility_course', name: 'Start Fouthia Rooftop Run (Lvl 35)', courseId: 'fouthia_rooftop_run' },
        ],
        regionId: 'fouthia',
        x: 160, y: 230,
        type: 'internal',
    },
};
