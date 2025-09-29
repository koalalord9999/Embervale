
import { POI, SkillName } from '../../types';
import { CIVILLIAN_DIALOGUE } from '../../constants';

export const oakhavenPois: Record<string, POI> = {
    // GATES (World Map POIs)
    oakhaven_north_gate: {
        id: 'oakhaven_north_gate',
        name: 'Oakhaven North Gate',
        description: 'Sturdy wooden gates mark the entrance to the town of Oakhaven. The scent of sawdust and tanning leather hangs in the air.',
        connections: ['oakhaven_road_2', 'oakhaven_square'],
        activities: [],
        regionId: 'wilderness',
        x: 1000, y: 1750,
        cityMapX: 250, cityMapY: 100,
        unlockRequirement: { type: 'quest', questId: 'bandit_toll', stage: 1 }
    },
    oakhaven_west_gate: {
        id: 'oakhaven_west_gate',
        name: 'Oakhaven West Gate',
        description: 'This gate leads out to the old King\'s Road, a once-major trade artery that has fallen into disuse. A guard eyes the road warily.',
        connections: ['oakhaven_crafting_district', 'kings_road_west_1'],
        activities: [
            {
                type: 'npc',
                name: 'Guard Captain Elara',
                icon: '/assets/npcChatHeads/guard_captain_elara.png',
                dialogue: {
                    default_dialogue: {
                        npcName: 'Guard Captain Elara',
                        npcIcon: '/assets/npcChatHeads/guard_captain_elara.png',
                        text: "Keep your wits about you. The roads aren't as safe as they once were.",
                        responses: [
                            { text: "What's the trouble on the King's Road?", next: 'quest_intro_capitals_call'},
                            { text: "I'll be careful.", next: 'careful_response' },
                        ]
                    },
                    careful_response: {
                        npcName: 'Guard Captain Elara',
                        npcIcon: '/assets/npcChatHeads/guard_captain_elara.png',
                        text: "Good. See that you do. The safety of this town relies on vigilant travelers like yourself.",
                        responses: []
                    },
                    quest_intro_capitals_call: {
                        npcName: 'Guard Captain Elara',
                        npcIcon: '/assets/npcChatHeads/guard_captain_elara.png',
                        text: "Trouble? It's a disaster! The main bridge collapsed, cutting off our trade with Silverhaven. Food and supplies are running low, and to make matters worse, a patrol I sent to investigate hasn't returned.",
                        responses: [
                            { text: "That sounds serious. How can I help?", next: 'details_capitals_call' },
                        ]
                    },
                    details_capitals_call: {
                        npcName: 'Guard Captain Elara',
                        npcIcon: '/assets/npcChatHeads/guard_captain_elara.png',
                        text: "I need someone capable to go to the bridge and find out what really happened. An engineer's report said it was sound just last month... this feels wrong. Find out what happened to my patrol, and to the bridge. Here, take my signet. Show it to any survivors.",
                        responses: [
                            { text: "I'll get to the bottom of this.", actions: [{ type: 'start_quest', questId: 'capitals_call' }, { type: 'give_item', itemId: 'elaras_signet', quantity: 1 }] },
                            { text: "This sounds too dangerous for me.", next: 'reject_capitals_call' },
                        ]
                    },
                    reject_capitals_call: {
                        npcName: 'Guard Captain Elara',
                        npcIcon: '/assets/npcChatHeads/guard_captain_elara.png',
                        text: "Disappointing. I had hoped you had more spine. The safety of two towns rests on this, and you shy away? Then step aside. I need a real hero.",
                        responses: []
                    },
                    in_progress_capitals_call_0: {
                        npcName: 'Guard Captain Elara',
                        npcIcon: '/assets/npcChatHeads/guard_captain_elara.png',
                        text: "Be careful out there. The situation at the bridge is more dangerous than it seems. Find out what happened.",
                        responses: []
                    },
                    in_progress_capitals_call_1: {
                        npcName: 'Guard Captain Elara',
                        npcIcon: '/assets/npcChatHeads/guard_captain_elara.png',
                        text: "An insignia? This is good work, soldier. Let me see... I don't recognize this serpent mark. It's not a known bandit clan in this region. However, Oakhaven's artisans have an eye for detail. They deal with shipments from all over and might recognize the craftsmanship.",
                        responses: [
                            { text: "Who should I speak to?", next: 'cc_elara_send_to_finn' }
                        ]
                    },
                    cc_elara_send_to_finn: {
                        npcName: 'Guard Captain Elara',
                        npcIcon: '/assets/npcChatHeads/guard_captain_elara.png',
                        text: "Take this to Finn the Rope-maker in the Artisan's Quarter. If anyone has seen this mark on a shipping crate or a coil of rope, it's him. Let me know what you find.",
                        responses: [
                            { text: "I'll see what he knows.", actions: [{ type: 'advance_quest', questId: 'capitals_call' }] }
                        ]
                    },
                    in_progress_capitals_call_2: {
                        npcName: 'Guard Captain Elara',
                        npcIcon: '/assets/npcChatHeads/guard_captain_elara.png',
                        text: "Any news on the insignia? I've been doing some digging myself. The 'Serpent Bandits' are more like ghosts. They strike trade routes, disable infrastructure, but rarely engage in straight fights. They seem more interested in causing chaos than in simple plunder.",
                        responses: [
                            { text: "Where do they come from?", next: 'cc_elara_lore_1' },
                            { text: "I'm focusing on the repairs for now.", next: 'elara_exit_working' },
                        ]
                    },
                    in_progress_capitals_call_3: {
                        npcName: 'Guard Captain Elara',
                        npcIcon: '/assets/npcChatHeads/guard_captain_elara.png',
                        text: "Have you managed to acquire the reinforced cable and supports yet? The whole town is counting on you.",
                        responses: [
                            { text: "Any more information on the Serpent Bandits?", next: 'cc_elara_lore_1' },
                            { text: "I'm still working on it.", next: 'elara_exit_working' },
                        ]
                    },
                    elara_exit_working: {
                        npcName: 'Guard Captain Elara',
                        npcIcon: '/assets/npcChatHeads/guard_captain_elara.png',
                        text: "Understood. The safety of two towns rests on your shoulders. Don't fail us.",
                        responses: []
                    },
                    cc_elara_lore_1: {
                        npcName: 'Guard Captain Elara',
                        npcIcon: '/assets/npcChatHeads/guard_captain_elara.png',
                        text: "No one knows. They leave no tracks. Some of the older folk have superstitions, of course. If you want to hear some stories, try talking to Bronn, the old adventurer who's always warming a stool at The Carved Mug. He's seen more of this world than I have.",
                        responses: [
                            { text: "I'll talk to him. Thanks, Captain." },
                        ]
                    },
                    in_progress_capitals_call_4: {
                        npcName: 'Guard Captain Elara',
                        npcIcon: '/assets/npcChatHeads/guard_captain_elara.png',
                        text: "You have them! By the forge, you've done it! With these specialized materials, my engineers can finally repair the bridge properly. You've saved this town from economic collapse. Thank you, adventurer.",
                        responses: [
                            { text: "Happy to help restore the trade route.", actions: [{ type: 'give_xp', skill: SkillName.Crafting, amount: 2000 }, { type: 'give_xp', skill: SkillName.Woodcutting, amount: 2000 }, { type: 'give_coins', amount: 2500 }, { type: 'advance_quest', questId: 'capitals_call' }] },
                        ]
                    },
                    post_quest_capitals_call: {
                        npcName: 'Guard Captain Elara',
                        npcIcon: '/assets/npcChatHeads/guard_captain_elara.png',
                        text: "Thanks to your help, the bridge is secure and the road to Silverhaven is open once more. We're all in your debt. Be wary of those Serpent Bandits, though.",
                        responses: []
                    },
                },
                startNode: 'default_dialogue'
            },
        ],
        regionId: 'wilderness',
        x: 950, y: 1800,
        cityMapX: 100, cityMapY: 160,
    },

    // CITY CENTER (Internal POI)
    oakhaven_square: {
        id: 'oakhaven_square',
        name: 'Oakhaven Square',
        description: 'The center of the crafting town. A serene-looking wishing well sits in the middle of the square. Roads lead to the gates and various districts.',
        connections: ['oakhaven_north_gate', 'oakhaven_market', 'oakhaven_crafting_district', 'oakhaven_tavern_street', 'oakhaven_bank'],
        activities: [
            { type: 'wishing_well' },
            { type: 'water_source', name: 'Collect Water' },
            {
                type: 'npc',
                name: 'Craftsman',
                icon: '/assets/npcChatHeads/artisan.png',
                dialogue: {
                    start: {
                        npcName: 'Craftsman',
                        npcIcon: '/assets/npcChatHeads/artisan.png',
                        text: CIVILLIAN_DIALOGUE.oakhaven.join('\n\n'),
                        responses: []
                    }
                },
                startNode: 'start',
                dialogueType: 'random',
                actions: [{ label: 'Pickpocket', disabled: true }]
            },
        ],
        regionId: 'oakhaven',
        x: 250, y: 160,
        type: 'internal',
    },

    // DISTRICTS & STREETS (Internal POIs)
    oakhaven_market: {
        id: 'oakhaven_market',
        name: 'Oakhaven Market',
        description: 'A bustling market street lined with various stalls. The general store is just off the main thoroughfare.',
        connections: ['oakhaven_square', 'oakhaven_general_store'],
        activities: [],
        regionId: 'oakhaven',
        x: 310, y: 160,
        type: 'internal',
    },
    oakhaven_crafting_district: {
        id: 'oakhaven_crafting_district',
        name: 'Crafting District',
        description: 'The sound of work fills the air here. Tanning racks and workbenches line the street, leading to various artisan shops.',
        connections: ['oakhaven_square', 'oakhaven_crafting_supplies', 'tanner_svens_shop', 'oakhaven_west_gate', 'oakhaven_herblore_shop', 'oakhaven_artisans_quarter'],
        activities: [],
        regionId: 'oakhaven',
        x: 190, y: 160,
        type: 'internal',
    },
    oakhaven_artisans_quarter: {
        id: 'oakhaven_artisans_quarter',
        name: 'Oakhaven Artisan\'s Quarter',
        description: 'A quieter section of the district where master craftsmen have their workshops. The smell of oiled wood and hemp rope is strong here.',
        connections: ['oakhaven_crafting_district', 'oakhaven_woodworkers_shop'],
        activities: [
            {
                type: 'npc',
                name: 'Finn the Rope-maker',
                icon: '/assets/npcChatHeads/finn_the_rope_maker.png',
                dialogue: {
                    default_dialogue: {
                        npcName: 'Finn the Rope-maker',
                        npcIcon: '/assets/npcChatHeads/finn_the_rope_maker.png',
                        text: "Welcome to my workshop. Finest rope in the kingdom, made right here. What can I do for you?",
                        responses: []
                    },
                    in_progress_capitals_call_2: {
                        npcName: 'Finn the Rope-maker',
                        npcIcon: '/assets/npcChatHeads/finn_the_rope_maker.png',
                        text: "An insignia? Let me see... By my grandfather's beard, it's the mark of the Serpent Bandits! A nasty clan known for economic sabotage. They must be behind the bridge collapse!",
                        responses: [
                            { text: "What needs to be done to fix the bridge?", next: 'cc_finn_explain_materials' }
                        ]
                    },
                    cc_finn_explain_materials: {
                        npcName: 'Finn the Rope-maker',
                        npcIcon: '/assets/npcChatHeads/finn_the_rope_maker.png',
                        text: "To repair the bridge properly, we need two very specific components. I can weave a new Reinforced Bridge Cable, but the bandits stole my entire supply of Glimmer-thread Fibers. You'll need to get five of them from the Glimmerhorn Stags in the Verdant Fields.",
                        responses: [
                            { text: "What's the other component?", next: 'cc_finn_explain_alaric' }
                        ]
                    },
                    cc_finn_explain_alaric: {
                        npcName: 'Finn the Rope-maker',
                        npcIcon: '/assets/npcChatHeads/finn_the_rope_maker.png',
                        text: "The engineers also need new anchor supports. You'll need to speak with Alaric the Woodworker. He's the only one skilled enough to make them. He'll tell you what he needs. His shop is just around the corner in the Artisan's Quarter. Get both components, and we can save this town.",
                        responses: [
                            { text: "I'll get the materials.", actions: [{ type: 'advance_quest', questId: 'capitals_call' }] }
                        ]
                    },
                    in_progress_capitals_call_3: {
                        npcName: 'Finn the Rope-maker',
                        npcIcon: '/assets/npcChatHeads/finn_the_rope_maker.png',
                        text: "Have you managed to get those five Glimmer-thread Fibers? The looms are waiting.",
                        responses: [
                            { text: "I have them right here.", check: { requirements: [{ type: 'items', items: [{ itemId: 'glimmer_thread_fiber', quantity: 5 }] }], successNode: 'craft_cable_success', failureNode: 'fibers_fail' }, actions: [{ type: 'take_item', itemId: 'glimmer_thread_fiber', quantity: 5 }, { type: 'give_item', itemId: 'reinforced_bridge_cable', quantity: 1 }] },
                            { text: "Not yet, I'm still working on it.", next: 'finn_exit_working' },
                        ]
                    },
                    craft_cable_success: {
                        npcName: 'Finn the Rope-maker',
                        npcIcon: '/assets/npcChatHeads/finn_the_rope_maker.png',
                        text: "Wonderful! I'll get to work right away. Here is the Reinforced Bridge Cable. Now get those supports from Alaric!",
                        responses: []
                    },
                    fibers_fail: {
                        npcName: 'Finn the Rope-maker',
                        npcIcon: '/assets/npcChatHeads/finn_the_rope_maker.png',
                        text: "Trying to pull a fast one on a craftsman, eh? I can tell Glimmer-thread from a mile away, and you don't have it. Now go get it before I tie you up with your own shoelaces.",
                        responses: [
                            { text: "My mistake. I'll be back." },
                        ]
                    },
                    finn_exit_working: {
                        npcName: 'Finn the Rope-maker',
                        npcIcon: '/assets/npcChatHeads/finn_the_rope_maker.png',
                        text: "Well, don't dally. The longer that bridge is out, the tighter our belts get around here. You'll find the stags in the Verdant Fields.",
                        responses: []
                    },
                    post_quest_capitals_call: {
                        npcName: 'Finn the Rope-maker',
                        npcIcon: '/assets/npcChatHeads/finn_the_rope_maker.png',
                        text: "Good to see you again! Thanks to you, my ropes are securing the King's Road once more. A fine day's work!",
                        responses: []
                    },
                },
                startNode: 'default_dialogue',
            }
        ],
        regionId: 'oakhaven',
        x: 190, y: 200,
        type: 'internal',
    },
    oakhaven_tavern_street: {
        id: 'oakhaven_tavern_street',
        name: 'Tavern Street',
        description: 'A quieter side street leading to the local tavern.',
        connections: ['oakhaven_square', 'the_carved_mug'],
        activities: [],
        regionId: 'oakhaven',
        x: 250, y: 220,
        type: 'internal',
    },

    // BUILDINGS (Internal POIs)
    oakhaven_general_store: {
        id: 'oakhaven_general_store',
        name: 'Oakhaven General Store',
        description: 'A well-stocked store with a variety of goods for the aspiring adventurer.',
        connections: ['oakhaven_market'],
        activities: [
            { type: 'shop', shopId: 'oakhaven_general' },
        ],
        regionId: 'oakhaven',
        x: 350, y: 140,
        type: 'internal',
    },
    oakhaven_crafting_supplies: {
        id: 'oakhaven_crafting_supplies',
        name: 'Artisan Supplies',
        description: 'A shop selling all manner of tools and materials for crafting.',
        connections: ['oakhaven_crafting_district'],
        activities: [
            { type: 'shop', shopId: 'oakhaven_crafting' },
        ],
        regionId: 'oakhaven',
        x: 150, y: 140,
        type: 'internal',
    },
    oakhaven_herblore_shop: {
        id: 'oakhaven_herblore_shop',
        name: "The Verdant Vial",
        description: "A shop filled with the scent of strange and wonderful herbs. Vials of colorful liquids line the shelves.",
        connections: ['oakhaven_crafting_district'],
        activities: [
            { type: 'shop', shopId: 'oakhaven_herblore' },
            {
                type: 'npc',
                name: 'Herbalist Anise',
                icon: '/assets/npcChatHeads/herbalist_anise.png',
                dialogue: {
                    start: {
                        npcName: 'Herbalist Anise',
                        npcIcon: '/assets/npcChatHeads/herbalist_anise.png',
                        text: "Welcome to my little shop. If you need anything for potion-making, you've come to the right place.\n\nThe key to a good potion is properly prepared ingredients. A pestle and mortar is a must-have for any aspiring herbalist.",
                        responses: []
                    }
                },
                startNode: 'start',
                dialogueType: 'random',
            }
        ],
        regionId: 'oakhaven',
        x: 190, y: 120,
        type: 'internal',
    },
    tanner_svens_shop: {
        id: 'tanner_svens_shop',
        name: "Tanner Sven's",
        description: 'The smell of cured hides is strong here. Sven works diligently at his tanning rack.',
        connections: ['oakhaven_crafting_district'],
        activities: [
            {
                type: 'npc',
                name: 'Tanner Sven',
                icon: '/assets/npcChatHeads/tanner_sven.png',
                dialogue: {
                    start: {
                        npcName: 'Tanner Sven',
                        npcIcon: '/assets/npcChatHeads/tanner_sven.png',
                        text: "Need some hides tanned? You've come to the right place. What have you got for me?",
                        responses: [
                            { text: "Tan Cowhide (5 coins)", check: { requirements: [{ type: 'items', items: [{ itemId: 'cowhide', quantity: 1 }] }, { type: 'coins', amount: 5 }], successNode: 'tan_cowhide_success', failureNode: 'tan_fail' }, actions: [{ type: 'take_item', itemId: 'cowhide', quantity: 1 }, { type: 'take_coins', amount: 5 }, { type: 'give_item', itemId: 'leather', quantity: 1 }, { type: 'give_xp', skill: SkillName.Crafting, amount: 2 }] },
                            { text: "Tan Boar Hide (8 coins)", check: { requirements: [{ type: 'items', items: [{ itemId: 'boar_hide', quantity: 1 }] }, { type: 'coins', amount: 8 }], successNode: 'tan_boar_hide_success', failureNode: 'tan_fail' }, actions: [{ type: 'take_item', itemId: 'boar_hide', quantity: 1 }, { type: 'take_coins', amount: 8 }, { type: 'give_item', itemId: 'boar_leather', quantity: 1 }, { type: 'give_xp', skill: SkillName.Crafting, amount: 4 }] },
                            { text: "Tan Wolf Pelt (15 coins)", check: { requirements: [{ type: 'items', items: [{ itemId: 'wolf_pelt', quantity: 1 }] }, { type: 'coins', amount: 15 }], successNode: 'tan_wolf_pelt_success', failureNode: 'tan_fail' }, actions: [{ type: 'take_item', itemId: 'wolf_pelt', quantity: 1 }, { type: 'take_coins', amount: 15 }, { type: 'give_item', itemId: 'wolf_leather', quantity: 1 }, { type: 'give_xp', skill: SkillName.Crafting, amount: 8 }] },
                            { text: "Tan Bear Pelt (25 coins)", check: { requirements: [{ type: 'items', items: [{ itemId: 'bear_pelt', quantity: 1 }] }, { type: 'coins', amount: 25 }], successNode: 'tan_bear_pelt_success', failureNode: 'tan_fail' }, actions: [{ type: 'take_item', itemId: 'bear_pelt', quantity: 1 }, { type: 'take_coins', amount: 25 }, { type: 'give_item', itemId: 'bear_leather', quantity: 1 }, { type: 'give_xp', skill: SkillName.Crafting, amount: 12 }] },
                            { text: "Just looking, thanks." },
                        ],
                    },
                    tan_cowhide_success: {
                        npcName: 'Tanner Sven',
                        npcIcon: '/assets/npcChatHeads/tanner_sven.png',
                        text: "Here is your finished leather.",
                        responses: []
                    },
                    tan_boar_hide_success: {
                        npcName: 'Tanner Sven',
                        npcIcon: '/assets/npcChatHeads/tanner_sven.png',
                        text: "Here is your finished leather.",
                        responses: []
                    },
                    tan_wolf_pelt_success: {
                        npcName: 'Tanner Sven',
                        npcIcon: '/assets/npcChatHeads/tanner_sven.png',
                        text: "Here is your finished leather.",
                        responses: []
                    },
                    tan_bear_pelt_success: {
                        npcName: 'Tanner Sven',
                        npcIcon: '/assets/npcChatHeads/tanner_sven.png',
                        text: "Here is your finished leather.",
                        responses: []
                    },
                    tan_fail: {
                        npcName: 'Tanner Sven',
                        npcIcon: '/assets/npcChatHeads/tanner_sven.png',
                        text: "You don't seem to have what's needed for that. Come back when you do.",
                        responses: []
                    }
                },
                startNode: 'start',
            }
        ],
        regionId: 'oakhaven',
        x: 150, y: 180,
        type: 'internal',
    },
    oakhaven_woodworkers_shop: {
        id: 'oakhaven_woodworkers_shop',
        name: "Alaric's Fine Woods",
        description: "The workshop of the master woodworker, Alaric. The air is rich with the scent of sawdust and wood varnish.",
        connections: ['oakhaven_artisans_quarter'],
        activities: [
            {
                type: 'npc',
                name: 'Alaric the Woodworker',
                icon: '/assets/npcChatHeads/artisan.png',
                dialogue: {
                    default_dialogue: {
                        npcName: 'Alaric the Woodworker',
                        npcIcon: '/assets/npcChatHeads/artisan.png',
                        text: "Welcome to my workshop. If it's quality woodwork you're after, you've come to the right place. What can I do for you?",
                        responses: [
                            { text: "Tell me about the woods of this land.", next: 'wood_lore_pine' },
                            { text: "Just looking around." },
                        ]
                    },
                    in_progress_capitals_call_3: {
                        npcName: 'Alaric the Woodworker',
                        npcIcon: '/assets/npcChatHeads/artisan.png',
                        text: "Ah, an adventurer! Finn sent you, I presume? I heard about the bridge. A real shame. I can craft the supports, but I'll need the right material. Ten Yew Logs, to be exact. They're strong and flexible, perfect for the job. You'll find them up on the treacherous Gale-Swept Peaks.",
                        responses: [
                            { text: "I have the 10 Yew Logs right here.", check: { requirements: [{ type: 'items', items: [{ itemId: 'yew_logs', quantity: 10 }] }], successNode: 'craft_supports_success', failureNode: 'yew_logs_fail' }, actions: [{ type: 'take_item', itemId: 'yew_logs', quantity: 10 }, { type: 'give_item', itemId: 'reinforced_bridge_supports', quantity: 1 }] },
                            { text: "I'll be back when I have them.", next: 'alaric_exit_gale' },
                            { text: "Tell me more about the different woods.", next: 'wood_lore_pine' },
                        ]
                    },
                    craft_supports_success: {
                        npcName: 'Alaric the Woodworker',
                        npcIcon: '/assets/npcChatHeads/artisan.png',
                        text: "Perfect! These will do nicely. Give me a moment... There. One set of Reinforced Bridge Supports, ready for installation. Good luck out there.",
                        responses: []
                    },
                    yew_logs_fail: {
                        npcName: 'Alaric the Woodworker',
                        npcIcon: '/assets/npcChatHeads/artisan.png',
                        text: "Do you take me for a fool? I can tell Yew from Pine just by the smell of it, and you certainly don't have ten Yew logs on you. Don't try to pull a fast one on a master woodworker. Now go get what I need!",
                        responses: [
                             { text: "Right. Of course. I'll be back." },
                        ]
                    },
                    alaric_exit_gale: {
                        npcName: 'Alaric the Woodworker',
                        npcIcon: '/assets/npcChatHeads/artisan.png',
                        text: "Be careful up there. The peaks are named 'Gale-Swept' for a reason. The wind can knock a man off his feet if he's not careful. The Yew trees grow in the most sheltered spots, usually.",
                        responses: []
                    },
                    post_quest_capitals_call: {
                        npcName: 'Alaric the Woodworker',
                        npcIcon: '/assets/npcChatHeads/artisan.png',
                        text: "Good to see you again. Thanks to those supports, the bridge should hold for another hundred years. Fine work.",
                        responses: [
                            { text: "Tell me about the woods of this land.", next: 'wood_lore_pine' },
                            { text: "Take care, Alaric." },
                        ]
                    },
                    wood_lore_pine: {
                        npcName: 'Alaric the Woodworker',
                        npcIcon: '/assets/npcChatHeads/artisan.png',
                        text: "Ah, a connoisseur! Well, the most common is Pine. It's what most of Meadowdale is built from. It's soft, easy to work with, but not very durable. Good for kindling and cheap furniture.",
                        responses: [
                            { text: "Interesting. What else?", next: 'wood_lore_oak' },
                            { text: "Get to the point.", next: 'wood_lore_yew' },
                            { text: "That's enough for now.", next: 'alaric_exit_lore_info' },
                        ]
                    },
                    wood_lore_oak: {
                        npcName: 'Alaric the Woodworker',
                        npcIcon: '/assets/npcChatHeads/artisan.png',
                        text: "Then you have Oak. Much harder, much stronger. Makes for fine bows and sturdy shields. Takes a keen eye to work it properly without splitting, but the results are worth it.",
                        responses: [
                            { text: "Tell me more.", next: 'wood_lore_willow' },
                            { text: "Get to the point.", next: 'wood_lore_yew' },
                            { text: "That's enough for now.", next: 'alaric_exit_lore_info' },
                        ]
                    },
                    wood_lore_willow: {
                        npcName: 'Alaric the Woodworker',
                        npcIcon: '/assets/npcChatHeads/artisan.png',
                        text: "Willow is a curious one. It's very light and flexible. Not much good for construction, but excellent for fletching lighter bows. It has a slight greenish tint to it.",
                        responses: [
                            { text: "And the magical ones?", next: 'wood_lore_feywood' },
                            { text: "Get to the point.", next: 'wood_lore_yew' },
                            { text: "That's enough for now.", next: 'alaric_exit_lore_info' },
                        ]
                    },
                    wood_lore_feywood: {
                        npcName: 'Alaric the Woodworker',
                        npcIcon: '/assets/npcChatHeads/artisan.png',
                        text: "The Feywood... now that's a different beast entirely. The logs have a purple hue and hum with a faint energy. They say it never rots. Makes for the most powerful bows, but the forest itself doesn't like giving it up.",
                        responses: [
                            { text: "So why Yew for the bridge?", next: 'wood_lore_yew' },
                            { text: "That's enough for now.", next: 'alaric_exit_lore_info' },
                        ]
                    },
                    wood_lore_yew: {
                        npcName: 'Alaric the Woodworker',
                        npcIcon: '/assets/npcChatHeads/artisan.png',
                        text: "Yew is the king of woods for structural work. It's incredibly dense and strong, but also has a natural resilience to water and rot. It can bend under great strain without breaking. Perfect for something like a bridge that needs to withstand the elements and heavy loads. It's the only choice, really.",
                        responses: [
                            { text: "Thank you for the info.", next: 'alaric_exit_thanks' },
                        ]
                    },
                    alaric_exit_lore_info: {
                        npcName: 'Alaric the Woodworker',
                        npcIcon: '/assets/npcChatHeads/artisan.png',
                        text: "Okay, well if you want more information, you know where to find me.",
                        responses: []
                    },
                    alaric_exit_thanks: {
                        npcName: 'Alaric the Woodworker',
                        npcIcon: '/assets/npcChatHeads/artisan.png',
                        text: "You're most welcome, and I hope you enjoy knowing a bit more about the life of a master woodworker.",
                        responses: []
                    }
                },
                startNode: 'default_dialogue',
            }
        ],
        regionId: 'oakhaven',
        x: 190, y: 240,
        type: 'internal',
    },
    the_carved_mug: {
        id: 'the_carved_mug',
        name: 'The Carved Mug',
        description: 'A cozy tavern filled with the warmth of a large cooking range and the smell of roasting meats.',
        connections: ['oakhaven_tavern_street'],
        activities: [
            { type: 'quest_board' },
            { type: 'cooking_range' },
            {
                type: 'npc',
                name: 'Barkeep Freya',
                icon: '/assets/npcChatHeads/barkeep_freya.png',
                dialogue: {
                    start: {
                        npcName: 'Barkeep Freya',
                        npcIcon: '/assets/npcChatHeads/barkeep_freya.png',
                        text: "Welcome to The Carved Mug. We've got the best ale and the softest beds in Oakhaven. What can I get for you?",
                        responses: [
                            { text: "A pint of your finest.", next: 'buy_drink_intro' },
                            { text: "I'd like to rent a room.", next: 'rent_room_intro' },
                        ]
                    },
                    buy_drink_intro: {
                        npcName: 'Barkeep Freya',
                        npcIcon: '/assets/npcChatHeads/barkeep_freya.png',
                        text: "An excellent choice! Warms the soul after a long day of crafting, eh? That'll be 3 coins.",
                        responses: [
                            { text: "Here you go.", check: { requirements: [{ type: 'coins', amount: 3 }], successNode: 'buy_drink_success', failureNode: 'buy_drink_fail' }, actions: [{ type: 'take_coins', amount: 3 }, { type: 'give_item', itemId: 'beer', quantity: 1 }] },
                            { text: "A bit steep for me." },
                        ]
                    },
                    buy_drink_success: {
                        npcName: 'Barkeep Freya',
                        npcIcon: '/assets/npcChatHeads/barkeep_freya.png',
                        text: "Cheers!",
                        responses: []
                    },
                    buy_drink_fail: {
                        npcName: 'Barkeep Freya',
                        npcIcon: '/assets/npcChatHeads/barkeep_freya.png',
                        text: "Sorry, you don't have enough coin for that.",
                        responses: []
                    },
                    rent_room_intro: {
                        npcName: 'Barkeep Freya',
                        npcIcon: '/assets/npcChatHeads/barkeep_freya.png',
                        text: "Wise adventurer. A good night's sleep in a proper bed does wonders for your health. A room for the night is 15 coins.",
                        responses: [
                            { text: "I'll take it.", check: { requirements: [{ type: 'coins', amount: 15 }], successNode: 'rent_room_success', failureNode: 'buy_drink_fail' }, actions: [{ type: 'take_coins', amount: 15 }, { type: 'heal', amount: 'full' }] },
                            { text: "I think I'll rough it." },
                        ]
                    },
                    rent_room_success: {
                        npcName: 'Barkeep Freya',
                        npcIcon: '/assets/npcChatHeads/barkeep_freya.png',
                        text: "Wonderful. Sleep well!",
                        responses: []
                    }
                },
                startNode: 'start',
            },
            {
                type: 'npc',
                name: 'Bronn the Retired Adventurer',
                icon: '/assets/npcChatHeads/bronn_the_retired_adventurer.png',
                dialogue: {
                    start: {
                        npcName: 'Bronn the Retired Adventurer',
                        npcIcon: '/assets/npcChatHeads/bronn_the_retired_adventurer.png',
                        text: "Hah! Seen a few things in my day, I have. Fought goblins that were bigger than a cow and twice as mean.\n\nIf you're heading up into the peaks, be wary of the harpies. Nasty creatures. Their feathers are sharp as steel, though.\n\nThey say the king of the goblins, Grumlok, has a soft spot for shiny things. Not that you'll get close enough to find out.",
                        responses: []
                    },
                    in_progress_capitals_call_2: {
                        npcName: 'Bronn the Retired Adventurer',
                        npcIcon: '/assets/npcChatHeads/bronn_the_retired_adventurer.png',
                        text: "Looking for information, are ya? Captain Elara send you? Hah! Knew she'd need a real adventurer's expertise eventually. The Serpent Bandits, you say? Not your average thugs.",
                        responses: [
                            { text: "What do you know about them?", next: 'cc_bronn_lore_1' },
                        ]
                    },
                    in_progress_capitals_call_3: {
                        npcName: 'Bronn the Retired Adventurer',
                        npcIcon: '/assets/npcChatHeads/bronn_the_retired_adventurer.png',
                        text: "Looking for information, are ya? Captain Elara send you? Hah! Knew she'd need a real adventurer's expertise eventually. The Serpent Bandits, you say? Not your average thugs.",
                        responses: [
                            { text: "What do you know about them?", next: 'cc_bronn_lore_1' },
                        ]
                    },
                    cc_bronn_lore_1: {
                        npcName: 'Bronn the Retired Adventurer',
                        npcIcon: '/assets/npcChatHeads/bronn_the_retired_adventurer.png',
                        text: "I've crossed paths with their work before, up near the northern peaks. They don't fight like bandits. They fight like soldiers. Coordinated. Precise. They use the terrain, strike at weak points... it's sabotage, not robbery. They never leave witnesses, either.",
                        responses: [
                            { text: "Any idea who they are?", next: 'cc_bronn_lore_2' },
                        ]
                    },
                    cc_bronn_lore_2: {
                        npcName: 'Bronn the Retired Adventurer',
                        npcIcon: '/assets/npcChatHeads/bronn_the_retired_adventurer.png',
                        text: "Some say they're remnants of a disgraced legion from the old wars. Others say they're something... older.沼地の蛇 (Numachi no hebi)... that's what a traveler from the far east called them. 'Swamp Serpents'. Said they rise from the muck when kingdoms get too comfortable. Now, buy an old man a drink, this talk is making me thirsty!",
                        responses: [
                            { text: "Thank you for the information, Bronn.", next: 'bronn_exit_thanks' },
                        ]
                    },
                    bronn_exit_thanks: {
                        npcName: 'Bronn the Retired Adventurer',
                        npcIcon: '/assets/npcChatHeads/bronn_the_retired_adventurer.png',
                        text: "Hmph. Information's not free, but I'll let it slide this time. Now let me get back to my drink.",
                        responses: []
                    }
                },
                startNode: 'start',
                dialogueType: 'random',
            }
        ],
        regionId: 'oakhaven',
        x: 310, y: 220,
        type: 'internal',
    },
    oakhaven_bank: {
        id: 'oakhaven_bank',
        name: 'Bank of Embrune',
        description: 'A sturdy, well-guarded building. Your items will be safe here.',
        connections: ['oakhaven_square'],
        activities: [
            { type: 'bank' },
            {
                type: 'npc',
                name: 'Banker Astrid',
                icon: '/assets/npcChatHeads/banker_astrid.png',
                dialogue: {
                    start: {
                        npcName: 'Banker Astrid',
                        npcIcon: '/assets/npcChatHeads/banker_astrid.png',
                        text: "Bank of Embrune, Oakhaven branch. How may I assist you?",
                        responses: []
                    }
                },
                startNode: 'start'
            }
        ],
        regionId: 'oakhaven',
        x: 190, y: 220,
        type: 'internal',
    },
};
