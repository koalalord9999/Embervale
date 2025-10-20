import { Quest, SkillName } from '../../types';

export const capitalsCall: Quest = {
    id: 'capitals_call',
    name: "The Capital's Call",
    description: "The main bridge on the King's Road has collapsed under suspicious circumstances, cutting off trade with the capital. Guard Captain Elara needs help.",
    startHint: "Speak to Guard Captain Elara at the Oakhaven West Gate about the road to the capital.",
    playerStagePerspectives: [
        "Captain Elara is worried about a collapsed bridge on the King's Road. I need to investigate what happened.",
        "The bridge was sabotaged! I found a strange serpent insignia. I should show this to Captain Elara.",
        "Elara doesn't recognize the insignia, but suggested I show it to Finn the Rope-maker in the Artisan's Quarter.",
        "Finn identified the Serpent Bandits! To fix the bridge, I need to get two special components. I need to bring 5 Glimmer-thread Fibers to Finn, and 10 Yew Logs to Alaric the Woodworker.",
        "I have both the cable and the supports! I should bring them to Captain Elara to complete the repairs."
    ],
    completionSummary: "I discovered that the bridge collapse was sabotage by the Serpent Bandits. I helped the local artisans craft new components: a reinforced cable from Finn and sturdy supports from a new woodworker, Alaric. With the materials delivered to Captain Elara, the King's Road to Silverhaven has been reopened.",
    stages: [
        {
            description: "Investigate the debris at the Broken Bridge.",
            requirement: { type: 'talk', poiId: 'broken_bridge', npcName: 'Investigate Debris' },
            stageRewards: {
                items: [{ itemId: 'torn_bandit_insignia', quantity: 1 }]
            }
        },
        {
            description: "Report back to Captain Elara in Oakhaven.",
            requirement: { type: 'talk', poiId: 'oakhaven_west_gate', npcName: 'Guard Captain Elara' }
        },
        {
            description: "Show the insignia to Finn the Rope-maker in Oakhaven's Artisan Quarter.",
            requirement: { type: 'talk', poiId: 'oakhaven_artisans_quarter', npcName: 'Finn the Rope-maker' }
        },
        {
            description: "Obtain the two components needed to repair the bridge: a Reinforced Bridge Cable from Finn and Reinforced Bridge Supports from Alaric.",
            requirement: { type: 'gather', items: [{ itemId: 'reinforced_bridge_cable', quantity: 1 }, { itemId: 'reinforced_bridge_supports', quantity: 1 }] }
        },
        {
            description: "Bring the Reinforced Bridge Cable and Supports to Guard Captain Elara.",
            requirement: { type: 'talk', poiId: 'oakhaven_west_gate', npcName: 'Guard Captain Elara' }
        }
    ],
    rewards: {
        xp: [{ skill: SkillName.Crafting, amount: 2000 }, { skill: SkillName.Woodcutting, amount: 2000 }],
        coins: 2500,
    },
    dialogue: {
        elara_default: {
            npcName: 'Guard Captain Elara',
            npcIcon: '/assets/npcChatHeads/guard_captain_elara.png',
            text: "Keep the roads safe, adventurer. A watchful eye prevents a bandit's blade.",
            responses: [],
            conditionalResponses: [
                {
                    text: "You mentioned trouble with the bridge?",
                    check: { requirements: [{ type: 'quest', questId: 'capitals_call', status: 'not_started' }], successNode: 'quest_intro_capitals_call', failureNode: '' }
                },
                {
                    text: "I have news about the bridge.",
                    check: { requirements: [{ type: 'quest', questId: 'capitals_call', status: 'in_progress', stage: 0 }], successNode: 'in_progress_capitals_call_0', failureNode: '' }
                },
                {
                    text: "I've investigated the bridge wreckage.",
                    check: { requirements: [{ type: 'quest', questId: 'capitals_call', status: 'in_progress', stage: 1 }], successNode: 'in_progress_capitals_call_1', failureNode: '' }
                },
                {
                    text: "I have the components to repair the bridge.",
                    check: { requirements: [{ type: 'quest', questId: 'capitals_call', status: 'in_progress', stage: 4 }], successNode: 'in_progress_capitals_call_4', failureNode: '' }
                },
                {
                    text: "It's good to see the bridge is repaired.",
                    check: { requirements: [{ type: 'quest', questId: 'capitals_call', status: 'completed' }], successNode: 'post_quest_capitals_call', failureNode: '' }
                }
            ]
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
        in_progress_capitals_call_4: {
            npcName: 'Guard Captain Elara',
            npcIcon: '/assets/npcChatHeads/guard_captain_elara.png',
            text: "You have them! By the forge, you've done it! With these specialized materials, my engineers can finally repair the bridge properly. You've saved this town from economic collapse. Thank you, adventurer.",
            responses: [
                { text: "Happy to help restore the trade route.", actions: [{ type: 'take_item', itemId: 'reinforced_bridge_cable', quantity: 1 }, { type: 'take_item', itemId: 'reinforced_bridge_supports', quantity: 1 }, { type: 'advance_quest', questId: 'capitals_call' }] },
            ]
        },
        post_quest_capitals_call: {
            npcName: 'Guard Captain Elara',
            npcIcon: '/assets/npcChatHeads/guard_captain_elara.png',
            text: "Thanks to your help, the bridge is secure and the road to Silverhaven is open once more. We're all in your debt. Be wary of those Serpent Bandits, though.",
            responses: []
        },
        investigate_debris_start: {
            npcName: 'Investigate Debris',
            npcIcon: 'https://api.iconify.design/game-icons:magnifying-glass.svg',
            text: "The bridge supports look like they were cut with an axe, and there are scorch marks here. It was sabotage! You find a torn piece of cloth with a strange coiled serpent insignia nearby.",
            responses: [
                { text: "(Take the insignia)", actions: [{ type: 'advance_quest', questId: 'capitals_call' }] }
            ]
        },
        finn_default: {
            npcName: 'Finn the Rope-maker',
            npcIcon: '/assets/npcChatHeads/finn_the_rope_maker.png',
            text: "Need some rope? I make the strongest in the land.",
            responses: [],
            conditionalResponses: [
                {
                    text: "Captain Elara sent me about the bridge.",
                    check: { requirements: [{ type: 'quest', questId: 'capitals_call', status: 'in_progress', stage: 2 }], successNode: 'finn_recognizes_insignia', failureNode: '' }
                },
                {
                    text: "I have the Glimmer-thread Fibers you needed.",
                    check: { requirements: [{ type: 'quest', questId: 'capitals_call', status: 'in_progress', stage: 3 }, { type: 'items', items: [{ itemId: 'glimmer_thread_fiber', quantity: 5 }] }], successNode: 'craft_cable_success', failureNode: 'fibers_fail' },
                    actions: [{ type: 'take_item', itemId: 'glimmer_thread_fiber', quantity: 5 }, { type: 'give_item', itemId: 'reinforced_bridge_cable', quantity: 1 }]
                },
                {
                    text: "I'm still working on getting those fibers.",
                    check: { requirements: [{ type: 'quest', questId: 'capitals_call', status: 'in_progress', stage: 3 }, { type: 'items', items: [{ itemId: 'glimmer_thread_fiber', quantity: 5, operator: 'lt' }] }], successNode: 'finn_exit_working', failureNode: '' }
                },
                {
                    text: "It's good to see you again.",
                    check: { requirements: [{ type: 'quest', questId: 'capitals_call', status: 'completed' }], successNode: 'finn_post_quest_capitals_call', failureNode: '' }
                }
            ]
        },
        finn_recognizes_insignia: {
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
            text: "The engineers also need new anchor supports. You'll need to speak with Alaric the Woodworker. He's the only one skilled enough to make them. He's been grumbling about needing 10 Yew Logs to make the supports. His shop is just around the corner in the Artisan's Quarter. Get both components, and we can save this town.",
            responses: [
                { text: "I'll get the materials.", actions: [{ type: 'advance_quest', questId: 'capitals_call' }] }
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
        finn_post_quest_capitals_call: {
            npcName: 'Finn the Rope-maker',
            npcIcon: '/assets/npcChatHeads/finn_the_rope_maker.png',
            text: "Good to see you again! Thanks to you, my ropes are securing the King's Road once more. A fine day's work!",
            responses: []
        },
        alaric_default: {
            npcName: 'Alaric the Woodworker',
            npcIcon: '/assets/npcChatHeads/artisan.png',
            text: "Welcome to my workshop. Finest woods in the land, shaped by a master's hand.",
            responses: [],
            conditionalResponses: [
                {
                    text: "Finn sent me about the bridge.",
                    check: { requirements: [{ type: 'quest', questId: 'capitals_call', status: 'in_progress', stage: 3 }], successNode: 'alaric_in_progress_capitals_call_3', failureNode: '' }
                },
                {
                    text: "It's good to see the bridge is repaired.",
                    check: { requirements: [{ type: 'quest', questId: 'capitals_call', status: 'completed' }], successNode: 'alaric_post_quest_capitals_call', failureNode: '' }
                }
            ]
        },
        alaric_in_progress_capitals_call_3: {
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
        alaric_post_quest_capitals_call: {
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
        },
        bronn_in_progress_capitals_call_2: {
            npcName: 'Bronn the Retired Adventurer',
            npcIcon: '/assets/npcChatHeads/bronn_the_retired_adventurer.png',
            text: "Looking for information, are ya? Captain Elara send you? Hah! Knew she'd need a real adventurer's expertise eventually. The Serpent Bandits, you say? Not your average thugs.",
            responses: [
                { text: "What do you know about them?", next: 'cc_bronn_lore_1' },
            ]
        },
        bronn_in_progress_capitals_call_3: {
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
    }
};