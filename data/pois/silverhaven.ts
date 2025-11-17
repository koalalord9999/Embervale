
import { POI, SkillName } from '../../types';
import { CIVILLIAN_DIALOGUE } from '../../constants/dialogue';

export const silverhavenPois: Record<string, POI> = {
    silverhaven_gates: {
        id: 'silverhaven_gates',
        name: 'Silverhaven Gates',
        description: 'The magnificent main gates of the capital city, Silverhaven. The walls are high and well-guarded.',
        connections: ['silverhaven_outskirts', 'silverhaven_square'],
        activities: [],
        regionId: 'silverhaven',
        type: 'internal',
        x: 250, y: 500,
        eX: 644, eY: 1813,
    },
    silverhaven_square: {
        id: 'silverhaven_square',
        name: 'Silverhaven Square',
        description: 'The bustling heart of the capital. A grand fountain depicting a silver dragon dominates the square. Paths lead to the city\'s various districts.',
        connections: ['silverhaven_gates', 'silverhaven_trade_district', 'silverhaven_artisans_quarter', 'silverhaven_docks', 'silverhaven_residential_district', 'silverhaven_castle_approach'],
        activities: [
            {
                type: 'npc',
                name: 'Town Crier',
                icon: '/assets/npcChatHeads/town_crier.png',
                pickpocket: { lootTableId: 'pickpocket_crier_table' },
                dialogue: {
                    start: {
                        npcName: 'Town Crier',
                        npcIcon: '/assets/npcChatHeads/town_crier.png',
                        text: "Hear ye, hear ye! All bounties must be registered with Slayer Master Kaelen at the Spire!\n\nHear ye, hear ye! Iron prices are up, due to the troubles in the south!\n\nHear ye, hear ye! The ferry to the Isle of Whispers departs daily from the docks! Passage is at your own risk!",
                        responses: []
                    }
                },
                startNode: 'start',
                dialogueType: 'random',
            },
            { type: 'water_source', name: 'Collect Water' },
            { type: 'npc', name: 'Man', icon: 'https://api.iconify.design/game-icons:person.svg', dialogue: { start: { npcName: 'Man', npcIcon: 'https://api.iconify.design/game-icons:person.svg', text: CIVILLIAN_DIALOGUE.general.join('\n\n'), responses: [] } }, startNode: 'start', dialogueType: 'random', attackableMonsterId: 'man', pickpocket: { lootTableId: 'pickpocket_silverhaven_citizen' } },
            { type: 'npc', name: 'Woman', icon: 'https://api.iconify.design/game-icons:woman-elf-face.svg', dialogue: { start: { npcName: 'Woman', npcIcon: 'https://api.iconify.design/game-icons:woman-elf-face.svg', text: CIVILLIAN_DIALOGUE.general.join('\n\n'), responses: [] } }, startNode: 'start', dialogueType: 'random', attackableMonsterId: 'woman', pickpocket: { lootTableId: 'pickpocket_silverhaven_citizen' } },
            {
                type: 'npc',
                name: 'Citizen',
                icon: 'https://api.iconify.design/game-icons:person.svg',
                pickpocket: { lootTableId: 'pickpocket_silverhaven_citizen' },
                dialogue: {
                     start: {
                        npcName: 'Citizen',
                        npcIcon: 'https://api.iconify.design/game-icons:person.svg',
                        text: CIVILLIAN_DIALOGUE.silverhaven.join('\n\n'),
                        responses: []
                    }
                },
                startNode: 'start',
                dialogueType: 'random'
            },
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
        regionId: 'silverhaven',
        x: 250, y: 340,
        type: 'internal',
    },
    silverhaven_trade_district: {
        id: 'silverhaven_trade_district',
        name: 'Trade District',
        description: 'A wide avenue lined with opulent shops and the imposing structure of the Grand Bank of Embrune.',
        connections: ['silverhaven_square', 'silverhaven_bank'],
        activities: [
            { type: 'thieving_stall', id: 'silverhaven_trade_district_gem_stall', name: 'Steal from Gem Stall', lootTableId: 'thieving_stall_gem' },
            { type: 'shop', shopId: 'silverhaven_general' },
            { type: 'npc', name: 'Man', icon: 'https://api.iconify.design/game-icons:person.svg', dialogue: { start: { npcName: 'Man', npcIcon: 'https://api.iconify.design/game-icons:person.svg', text: CIVILLIAN_DIALOGUE.general.join('\n\n'), responses: [] } }, startNode: 'start', dialogueType: 'random', attackableMonsterId: 'man', pickpocket: { lootTableId: 'pickpocket_silverhaven_citizen' } },
            { type: 'npc', name: 'Woman', icon: 'https://api.iconify.design/game-icons:woman-elf-face.svg', dialogue: { start: { npcName: 'Woman', npcIcon: 'https://api.iconify.design/game-icons:woman-elf-face.svg', text: CIVILLIAN_DIALOGUE.general.join('\n\n'), responses: [] } }, startNode: 'start', dialogueType: 'random', attackableMonsterId: 'woman', pickpocket: { lootTableId: 'pickpocket_silverhaven_citizen' } },
            {
                type: 'npc',
                name: 'Merchant Theron',
                icon: '/assets/npcChatHeads/merchant_theron.png',
                pickpocket: { lootTableId: 'pickpocket_merchant_table' },
                startNode: 'theron_default',
                questTopics: ['missing_shipment'],
            },
            {
                type: 'npc',
                name: 'Historian Pallas',
                icon: '/assets/npcChatHeads/historian_pallas.png',
                pickpocket: { lootTableId: 'pickpocket_adventurer_table' },
                dialogue: {
                    start: {
                        npcName: 'Historian Pallas',
                        npcIcon: '/assets/npcChatHeads/historian_pallas.png',
                        text: "Ah, the King's Road. A marvel of engineering from the old kingdom. Paved with stones from the Gale-Swept Peaks, they say.\n\nThe Sunken Labyrinth on the Isle of Whispers? It predates the kingdom, perhaps even humanity. It was a temple to a forgotten god of the deep. Some say its builders never left.",
                        responses: []
                    }
                },
                startNode: 'start',
                dialogueType: 'random',
            },
            {
                type: 'npc',
                name: 'Guard',
                icon: '/assets/npcChatHeads/guard_captain_elara.png',
                pickpocket: { lootTableId: 'pickpocket_guard_table' },
                attackableMonsterId: 'guard',
                dialogue: {
                    start: {
                        npcName: 'Guard',
                        npcIcon: '/assets/npcChatHeads/guard_captain_elara.png',
                        text: CIVILLIAN_DIALOGUE.silverhaven.join('\n\n'),
                        responses: []
                    }
                },
                startNode: 'start',
                dialogueType: 'random'
            },
        ],
        regionId: 'silverhaven',
        x: 310, y: 320,
        type: 'internal',
    },
    silverhaven_bank: {
        id: 'silverhaven_bank',
        name: 'Grand Bank of Embrune',
        description: 'The central bank of the region. Your gold is safest here.',
        connections: ['silverhaven_trade_district'],
        activities: [
            {
                type: 'npc',
                name: 'Banker Cassian',
                icon: '/assets/npcChatHeads/banker_theron.png',
                actions: [
                    { label: 'Bank', action: 'open_bank' },
                    { label: 'Deposit Backpack', action: 'deposit_backpack' },
                    { label: 'Deposit Equipment', action: 'deposit_equipment' },
                ],
                dialogue: {
                    start: {
                        npcName: 'Banker Cassian',
                        npcIcon: '/assets/npcChatHeads/banker_theron.png',
                        text: "Welcome to the Grand Bank of Embrune. How can we serve your financial needs today?",
                        responses: [
                            { text: "I'd like to use my bank vault.", next: 'access_bank' },
                            { text: "Just admiring the architecture." }
                        ]
                    },
                    access_bank: {
                        npcName: 'Banker Cassian',
                        npcIcon: '/assets/npcChatHeads/banker_theron.png',
                        text: "Of course, your vault is ready for you. Shall I open it?",
                        responses: [
                            { text: "Yes, please.", actions: [{ type: 'open_bank' }] },
                            { text: "No, that's all for now." }
                        ]
                    }
                },
                startNode: 'start'
            },
            { type: 'thieving_lockpick', id: 'sh_bank_chest_1', targetName: 'Vault Box', lootTableId: 'thieving_dungeon_chest_elite' },
        ],
        regionId: 'silverhaven',
        x: 310, y: 280,
        type: 'internal',
    },
    silverhaven_artisans_quarter: {
        id: 'silverhaven_artisans_quarter',
        name: 'Artisan\'s Quarter',
        description: 'The sounds of hammers and saws fill the air here. Master craftsmen offer their services and wares here.',
        connections: ['silverhaven_square', 'silverhaven_smithy', 'silverhaven_arcane_wares'],
        activities: [
             { type: 'thieving_stall', id: 'silverhaven_artisans_quarter_weapon_stall', name: 'Steal from Weapon Stall', lootTableId: 'thieving_stall_weapon' },
             { type: 'shop', shopId: 'silverhaven_crafting' },
             { type: 'anvil' },
             { type: 'spinning_wheel'},
             {
                type: 'npc',
                name: 'Artisan',
                icon: '/assets/npcChatHeads/artisan.png',
                pickpocket: { lootTableId: 'pickpocket_yeoman_table' },
                attackableMonsterId: 'yeoman',
                dialogue: {
                    start: {
                        npcName: 'Artisan',
                        npcIcon: '/assets/npcChatHeads/artisan.png',
                        text: "Strange noises echo down from the peaks on a clear night... like a hammer on an anvil, but with a clearer ring than any metal I know.\n\nSome old prospectors talk of a recluse up in the mountains, a smith who shuns cities. Probably just a story to scare off claim-jumpers.",
                        responses: []
                    }
                },
                startNode: 'start'
            }
        ],
        regionId: 'silverhaven',
        x: 190, y: 280,
        type: 'internal',
    },
    silverhaven_arcane_wares: {
        id: 'silverhaven_arcane_wares',
        name: 'Silverhaven Arcane Wares',
        description: 'A shop filled with the scent of old parchment and strange herbs. The air crackles with magical energy.',
        connections: ['silverhaven_artisans_quarter'],
        activities: [
            { type: 'thieving_stall', id: 'silverhaven_arcane_wares_herb_stall', name: 'Steal from Herb Stall', lootTableId: 'thieving_stall_herb' },
            { type: 'thieving_stall', id: 'silverhaven_arcane_wares_potion_stall', name: 'Steal from Potion Stall', lootTableId: 'thieving_stall_potion' },
            { type: 'shop', shopId: 'silverhaven_magic_shop' },
            { type: 'bookbinding_workbench' },
            {
                type: 'npc',
                name: 'Archmage Theron',
                icon: 'https://api.iconify.design/game-icons:wizard-face.svg',
                startNode: 'theron_default',
                questTopics: ['the_arcane_awakening'],
                conditionalGreetings: [
                    {
                        text: "Hmm... the patterns are frayed... the resonance is... unstable... *Theron looks up, startled.* Oh! Apologies, I was lost in thought. A fine day for trade, is it not? Though... I sense you have an affinity for the arcane yourself.",
                        check: {
                            requirements: [
                                { type: 'quest', questId: 'the_arcane_awakening', status: 'not_started' },
                                { type: 'skill', skill: SkillName.Magic, level: 40 },
                                { type: 'quest', questId: 'capitals_call', status: 'completed' }
                            ]
                        }
                    },
                    // Ordered from highest stage to lowest for priority
                    { text: "You've returned! I can feel it... the Weave is calm. Tell me, did you succeed?", check: { requirements: [{ type: 'quest', questId: 'the_arcane_awakening', status: 'in_progress', stage: 9 }] } },
                    { text: "The Cascade is reaching its peak! You must be at the spire's apex. Do not fail!", check: { requirements: [{ type: 'quest', questId: 'the_arcane_awakening', status: 'in_progress', stage: 8 }] } },
                    { text: "How goes the investigation on the Isles? The Magus Spire holds the key to this disturbance.", check: { requirements: [{ type: 'quest', questId: 'the_arcane_awakening', status: 'in_progress', stage: 7 }] } },
                    { text: "You have the dampener? The Skyship Captain at the docks is waiting for it. Every moment counts!", check: { requirements: [{ type: 'quest', questId: 'the_arcane_awakening', status: 'in_progress', stage: 6 }] } },
                    { text: "Have you returned to Durin with the components for the dampener? He awaits them at the Dwarven Outpost.", check: { requirements: [{ type: 'quest', questId: 'the_arcane_awakening', status: 'in_progress', stage: 5 }] } },
                    { text: "The components for the dampener won't gather themselves. Your task is out in the world, not here in my shop.", check: { requirements: [{ type: 'quest', questId: 'the_arcane_awakening', status: 'in_progress', stage: 4 }] } },
                    { text: "You should be on your way to the Dwarven Outpost to speak with the smith, Durin. He is our only hope for reaching the isles.", check: { requirements: [{ type: 'quest', questId: 'the_arcane_awakening', status: 'in_progress', stage: 3 }] } },
                    { text: "Why are you back here? I told you to speak with the Skyship Captain at the Silverhaven Docks.", check: { requirements: [{ type: 'quest', questId: 'the_arcane_awakening', status: 'in_progress', stage: 2 }] } },
                    { text: "Have you taken the readings from the three altars yet? Time is of the essence.", check: { requirements: [{ type: 'quest', questId: 'the_arcane_awakening', status: 'in_progress', stage: 0 }] } },
                    { text: "Thank you again for your help, hero. The Arcane Weave is stable.", check: { requirements: [{ type: 'quest', questId: 'the_arcane_awakening', status: 'completed' }] } }
                ],
                dialogue: {
                    theron_default: {
                        npcName: 'Archmage Theron',
                        npcIcon: 'https://api.iconify.design/game-icons:wizard-face.svg',
                        text: "Hmm... The weave of magic is a delicate thing. One must always be vigilant.",
                        responses: [],
                    }
                }
            },
            { type: 'thieving_lockpick', id: 'sh_arcane_chest_1', targetName: 'Runic Cabinet', lootTableId: 'thieving_dungeon_chest_high' },
        ],
        regionId: 'silverhaven',
        x: 190, y: 320,
        type: 'internal',
    },
    silverhaven_smithy: {
        id: 'silverhaven_smithy',
        name: 'The Gilded Hammer',
        description: 'The finest smithy in the land. The heat from the grand furnace is immense.',
        connections: ['silverhaven_artisans_quarter'],
        activities: [
            { type: 'furnace' },
            { type: 'shop', shopId: 'gilded_hammer_armory' },
            {
                type: 'npc',
                name: 'Master Smith Gideon',
                icon: '/assets/npcChatHeads/master_smith_gideon.png',
                pickpocket: { lootTableId: 'pickpocket_adventurer_table' },
                dialogue: {
                    start: {
                        npcName: 'Master Smith Gideon',
                        npcIcon: '/assets/npcChatHeads/master_smith_gideon.png',
                        text: "This city has the finest forges, but some say the greatest smith of our age isn't in a city at all.\n\nI once heard a tale of an old master named Borin Stonehand who retired to the Gale-Swept Peaks. They say he perfected the art of the warhammer, forging weapons that could shatter stone like glass.",
                        responses: []
                    }
                },
                startNode: 'start'
            },
            { type: 'thieving_lockpick', id: 'sh_smithy_chest_1', targetName: "Smith's Chest", lootTableId: 'thieving_dungeon_chest_high' },
        ],
        regionId: 'silverhaven',
        x: 130, y: 280,
        type: 'internal',
    },
    silverhaven_docks: {
        id: 'silverhaven_docks',
        name: 'Silverhaven Docks',
        description: 'The smell of salt and fish hangs in the air. Ships from distant lands are moored at the long wooden piers.',
        connections: ['silverhaven_square', 'silverhaven_fish_market'],
        activities: [
            { type: 'thieving_stall', id: 'silverhaven_docks_fish_stall', name: 'Steal from Fish Stall', lootTableId: 'thieving_stall_fish' },
            {
                type: 'npc',
                name: 'Ferryman Silas',
                icon: '/assets/npcChatHeads/ferryman_silas.png',
                dialogue: {
                    start: {
                        npcName: 'Ferryman Silas',
                        npcIcon: '/assets/npcChatHeads/ferryman_silas.png',
                        text: "Ready to leave the isle? Or perhaps venture somewhere new?",
                        responses: [
                            { text: "Take the ferry to the Isle of Whispers. (10 coins)", check: { requirements: [{ type: 'coins', amount: 10 }], successNode: 'travel_whispers_success', failureNode: 'travel_fail' }, actions: [{ type: 'take_coins', amount: 10 }, { type: 'teleport', poiId: 'port_wreckage_docks' }] },
                            { text: "Nowhere for now, thanks." },
                        ],
                    },
                    travel_whispers_success: {
                        npcName: 'Ferryman Silas',
                        npcIcon: '/assets/npcChatHeads/ferryman_silas.png',
                        text: "All aboard for the Isle of Whispers! Don't say I didn't warn ya...",
                        responses: []
                    },
                    travel_fail: {
                        npcName: 'Ferryman Silas',
                        npcIcon: '/assets/npcChatHeads/ferryman_silas.png',
                        text: "Sorry, friend. Passage ain't free. Come back when you have the coin.",
                        responses: []
                    }
                },
                startNode: 'start',
            },
            {
                type: 'npc',
                name: 'Skyship Captain',
                icon: '/assets/npcChatHeads/ferryman_silas.png', // Reusing icon for now
                startNode: 'captain_default',
                questTopics: ['the_arcane_awakening'],
                conditionalGreetings: [
                    // The Arcane Awakening (Ordered by stage descending)
                    { text: "Back from the Isles? The magical storms are still raging. Need passage back?", check: { requirements: [{ type: 'quest', questId: 'the_arcane_awakening', status: 'in_progress', stage: 8 }] } },
                    { text: "Back from the Isles? The magical storms are still raging. Need passage back?", check: { requirements: [{ type: 'quest', questId: 'the_arcane_awakening', status: 'in_progress', stage: 7 }] } },
                    { text: "Back from the mountains? I hope you have good news. The turbulence is getting worse.", check: { requirements: [{ type: 'quest', questId: 'the_arcane_awakening', status: 'in_progress', stage: 6 }] } },
                    { text: "State your business. The skies are rough today, so make it quick.", check: { requirements: [{ type: 'quest', questId: 'the_arcane_awakening', status: 'in_progress', stage: 2 }] } },
                    { text: "The hero of the hour! The skies have been calm and clear ever since your venture. If you ever need a ride back to the isles, it's on the house.", check: { requirements: [{ type: 'quest', questId: 'the_arcane_awakening', status: 'completed' }] } },
                ],
                dialogue: {
                    captain_default: {
                        npcName: 'Skyship Captain',
                        npcIcon: '/assets/npcChatHeads/ferryman_silas.png',
                        text: "The skies call, but they're a fickle mistress. Where are you looking to go?",
                        responses: [],
                    }
                }
            }
        ],
        regionId: 'silverhaven',
        x: 307, y: 394,
        type: 'internal',
    },
    silverhaven_fish_market: {
        id: 'silverhaven_fish_market',
        name: 'Fish Market',
        description: 'Fishermen hawk their latest catches. The ground is slick with seawater.',
        connections: ['silverhaven_docks'],
        activities: [
            { type: 'shop', shopId: 'silverhaven_fishing' }
        ],
        regionId: 'silverhaven',
        x: 307, y: 370,
        type: 'internal',
    },
     silverhaven_residential_district: {
        id: 'silverhaven_residential_district',
        name: 'Residential District',
        description: 'A quieter area with well-kept houses. Citizens go about their daily lives.',
        connections: ['silverhaven_square', 'the_gilded_goblet'],
        activities: [
             { type: 'npc', name: 'Man', icon: 'https://api.iconify.design/game-icons:person.svg', dialogue: { start: { npcName: 'Man', npcIcon: 'https://api.iconify.design/game-icons:person.svg', text: CIVILLIAN_DIALOGUE.general.join('\n\n'), responses: [] } }, startNode: 'start', dialogueType: 'random', attackableMonsterId: 'man', pickpocket: { lootTableId: 'pickpocket_silverhaven_citizen' } },
             {
                type: 'npc',
                name: 'Elara',
                icon: '/assets/npcChatHeads/elara.png',
                pickpocket: { lootTableId: 'pickpocket_knight_table' },
                attackableMonsterId: 'knight',
                startNode: 'elara_default_heirloom',
                questTopics: ['lost_heirloom'],
            },
            { type: 'thieving_pilfer', id: 'silverhaven_house_1', name: 'Locked Manor' },
            { type: 'thieving_pilfer', id: 'silverhaven_house_2', name: 'Locked Townhouse' },
            { type: 'thieving_pilfer', id: 'silverhaven_house_3', name: 'Locked Villa' },
            { type: 'thieving_pilfer', id: 'silverhaven_house_4', name: 'Locked Estate' },
        ],
        regionId: 'silverhaven',
        x: 250, y: 280,
        type: 'internal',
    },
    the_gilded_goblet: {
        id: 'the_gilded_goblet',
        name: 'The Gilded Goblet',
        description: 'An upscale tavern popular with wealthy merchants and off-duty guards. The ale is expensive, but potent.',
        connections: ['silverhaven_residential_district'],
        activities: [
            { type: 'quest_board' },
            { type: 'cooking_range' },
            {
                type: 'npc',
                name: 'Barkeep Sterling',
                icon: '/assets/npcChatHeads/barkeep_freya.png',
                dialogue: {
                    start: {
                        npcName: 'Barkeep Sterling',
                        npcIcon: '/assets/npcChatHeads/barkeep_freya.png',
                        text: "Welcome to The Gilded Goblet. We serve the finest spirits in the capital. What's your pleasure?",
                        responses: [
                            { text: "A pint of your best.", next: 'buy_drink_intro' },
                            { text: "I'd like to rent a room.", next: 'rent_room_intro' },
                        ]
                    },
                    buy_drink_intro: {
                        npcName: 'Barkeep Sterling',
                        npcIcon: '/assets/npcChatHeads/barkeep_freya.png',
                        text: "An excellent choice. This is Dragon's Breath Stout, imported from the Dwarven Outpost. Smooth, with a fiery finish. 10 coins.",
                        responses: [
                            { text: "Here you go.", check: { requirements: [{ type: 'coins', amount: 10 }], successNode: 'buy_drink_success', failureNode: 'buy_drink_fail' }, actions: [{ type: 'take_coins', amount: 10 }, { type: 'give_item', itemId: 'beer', quantity: 1 }] },
                            { text: "A bit rich for my blood." },
                        ]
                    },
                    buy_drink_success: {
                        npcName: 'Barkeep Sterling',
                        npcIcon: '/assets/npcChatHeads/barkeep_freya.png',
                        text: "Enjoy. And try not to breathe fire on the drapes.",
                        responses: []
                    },
                    buy_drink_fail: {
                        npcName: 'Barkeep Sterling',
                        npcIcon: '/assets/npcChatHeads/barkeep_freya.png',
                        text: "Perhaps a water, then? It's free.",
                        responses: []
                    },
                    rent_room_intro: {
                        npcName: 'Barkeep Sterling',
                        npcIcon: '/assets/npcChatHeads/barkeep_freya.png',
                        text: "We have the finest rooms in the city. Feather beds, clean sheets... a world away from the straw pallets in the countryside. A night's rest will cost you 50 coins.",
                        responses: [
                            { text: "I'll take it.", check: { requirements: [{ type: 'coins', amount: 50 }], successNode: 'rent_room_success', failureNode: 'buy_drink_fail' }, actions: [{ type: 'take_coins', amount: 50 }, { type: 'heal', amount: 'full' }] },
                            { text: "I think I'll find somewhere cheaper." },
                        ]
                    },
                    rent_room_success: {
                        npcName: 'Barkeep Sterling',
                        npcIcon: '/assets/npcChatHeads/barkeep_freya.png',
                        text: "Excellent. The room at the top of the stairs is yours. Sleep well.",
                        responses: []
                    }
                },
                startNode: 'start',
            },
            {
                type: 'npc',
                name: 'Retired Royal Guard',
                icon: '/assets/npcChatHeads/bronn_the_retired_adventurer.png',
                pickpocket: { lootTableId: 'pickpocket_knight_table' },
                attackableMonsterId: 'knight',
                dialogue: {
                    start: {
                        npcName: 'Retired Royal Guard',
                        npcIcon: '/assets/npcChatHeads/bronn_the_retired_adventurer.png',
                        text: "This city isn't as safe as it looks. The walls keep out the monsters, but the real threats are often inside. Keep your wits about you.",
                        responses: []
                    }
                },
                startNode: 'start'
            },
            { type: 'npc', name: 'Merchant', icon: '/assets/npcChatHeads/merchant_theron.png', dialogue: { start: { npcName: 'Merchant', npcIcon: '/assets/npcChatHeads/merchant_theron.png', text: CIVILLIAN_DIALOGUE.silverhaven.join('\n\n'), responses: [] } }, startNode: 'start', dialogueType: 'random', pickpocket: { lootTableId: 'pickpocket_merchant_table' } },
        ],
        regionId: 'silverhaven',
        x: 250, y: 240,
        type: 'internal',
    },
    silverhaven_castle_approach: {
        id: 'silverhaven_castle_approach',
        name: 'Castle Approach',
        description: 'A grand, tree-lined avenue leading north towards the Royal Castle. A tall, slender tower stands to the east.',
        connections: ['silverhaven_square', 'silverhaven_slayers_spire', 'silverhaven_castle_grounds'],
        activities: [],
        regionId: 'silverhaven',
        x: 150, y: 340,
        type: 'internal',
    },
     silverhaven_slayers_spire: {
        id: 'silverhaven_slayers_spire',
        name: 'Slayer\'s Spire',
        description: 'A tall tower dedicated to the elite monster hunters of the realm. At its peak, a strange, lighter-than-air vessel is moored.',
        connections: ['silverhaven_castle_approach'],
        activities: [
            { type: 'slayer_master', name: 'Kaelen', icon: '/assets/npcChatHeads/kaelen.png' },
            { type: 'blimp_travel', requiredSlayerLevel: 50, name: 'Slayer\'s Blimp (NYA)' }
        ],
        regionId: 'silverhaven',
        x: 150, y: 280,
        type: 'internal',
    },
    silverhaven_castle_grounds: {
        id: 'silverhaven_castle_grounds',
        name: 'Silverhaven Castle Grounds',
        description: 'The immaculate grounds of the Royal Castle. Powerful adventurers patrol the area.',
        connections: ['silverhaven_castle_approach'],
        activities: [
            {
                type: 'npc',
                name: 'Adventurer',
                icon: 'https://api.iconify.design/game-icons:adventurer.svg',
                pickpocket: { lootTableId: 'pickpocket_adventurer_table' },
                attackableMonsterId: 'adventurer',
                dialogue: { start: { npcName: 'Adventurer', npcIcon: 'https://api.iconify.design/game-icons:adventurer.svg', text: "Best be on your way. Only authorized personnel beyond this point.", responses: [] } },
                startNode: 'start',
            }
        ],
        regionId: 'silverhaven',
        x: 150, y: 240,
        type: 'internal',
    },
};
