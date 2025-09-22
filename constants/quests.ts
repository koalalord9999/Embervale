import { Quest, RepeatableQuest, SkillName } from '../types';

export const QUESTS: Record<string, Quest> = {
    tutorial_completion: {
        id: 'tutorial_completion',
        name: 'A New Adventure',
        description: "Complete your training in the enclave and venture out into the world.",
        isHidden: true,
        startHint: "Complete Leo's training.",
        playerStagePerspectives: ["I'm ready to leave the enclave. I should speak to Leo one last time."],
        completionSummary: "I completed my training with Leo and have now entered the main world of Embrune.",
        stages: [
            {
                description: "Leave the enclave and enter the world.",
                requirement: { type: 'talk', poiId: 'enclave_departure_point', npcName: 'Leo the Guide' },
            }
        ],
        rewards: {}
    },
    a_smiths_apprentice: {
        id: 'a_smiths_apprentice',
        name: "A Smith's Apprentice",
        description: "Valerius the Master Smith is looking for an extra pair of hands to help around the smithy. This could be a good opportunity to learn the craft.",
        startHint: "Speak to Valerius the Master Smith in Meadowdale.",
        startDialogueNode: 'start',
        playerStagePerspectives: [
            "Valerius needs me to bring him 1 Copper Ore and 1 Tin Ore.",
            "I should bring the ore back to Valerius.",
            "Valerius gave me a Bronze Bar and told me to smith a Bronze Dagger at the anvil.",
            "I've smithed the dagger. I should show it to Valerius."
        ],
        completionSummary: "I helped Valerius the smith by gathering ore for him. He taught me how to smelt it into a bar and then smith that bar into a dagger. I've learned the basics of smithing.",
        dialogue: {
            start: {
                npcName: 'Valerius the Master Smith',
                npcIcon: '/assets/npcChatHeads/valerius_the_master_smith.png',
                text: "You there! You look like you're not afraid of a bit of hard work. I could use some help, and you could learn a valuable skill. Interested?",
                responses: [
                    { text: "What do you need help with?", next: 'details' },
                    { text: "I'm not interested, thanks.", action: 'close' },
                ],
            },
            details: {
                npcName: 'Valerius the Master Smith',
                npcIcon: '/assets/npcChatHeads/valerius_the_master_smith.png',
                text: "I need ore. The foundation of all good smithing is good metal. The local mine is full of Copper and Tin. Bring me one of each, and I'll show you the first step of turning rock into a weapon.",
                responses: [
                    { text: "I'll be back with your ore.", action: 'accept_quest' },
                ],
            },
        },
        stages: [
            {
                description: "Gather 1 Copper Ore and 1 Tin Ore.",
                requirement: { type: 'gather', itemId: 'copper_ore', quantity: 1 },
            },
            {
                description: "Return to Valerius the Master Smith.",
                requirement: { type: 'talk', poiId: 'meadowdale_smithy', npcName: 'Valerius the Master Smith' },
                stageRewards: {
                    items: [{ itemId: 'bronze_bar', quantity: 1 }],
                    xp: [{ skill: SkillName.Smithing, amount: 25 }]
                }
            },
            {
                description: "Use the anvil to smith a Bronze Dagger.",
                requirement: { type: 'smith', itemId: 'bronze_dagger', quantity: 1 }
            },
            {
                description: "Show the Bronze Dagger to Valerius.",
                requirement: { type: 'talk', poiId: 'meadowdale_smithy', npcName: 'Valerius the Master Smith' }
            }
        ],
        rewards: {
            xp: [{ skill: SkillName.Smithing, amount: 100 }],
            coins: 100
        }
    },
    goblin_menace: {
        id: 'goblin_menace',
        name: 'Goblin Menace',
        description: "Old Man Fitzwilliam is being driven mad by a racket coming from the Stonebreak Mine. He suspects goblins are to blame.",
        startHint: "Speak to Old Man Fitzwilliam in the Meadowdale Square.",
        startDialogueNode: 'start',
        playerStagePerspectives: [
            "I need to take care of 5 goblins in the Stonebreak Mine to stop the racket.",
            "I should let Old Man Fitzwilliam know the goblins have been dealt with."
        ],
        completionSummary: "I dealt with the goblin problem in the mines. The racket has stopped, and Old Man Fitzwilliam paid me for my work.",
        dialogue: {
            start: {
                npcName: 'Old Man Fitzwilliam',
                npcIcon: '/assets/npcChatHeads/old_man_fitzwilliam.png',
                text: "My ears! My poor, old ears! It's an infernal racket from the Stonebreak Mine. It can only be one thing: goblins. If you can clear out a handful of them, maybe they'll get the message. I'll make it worth your while.",
                responses: [
                    { text: "Alright, I'll restore the peace. For a price.", action: 'accept_quest' },
                    { text: "Sounds dangerous. Not my problem.", action: 'close' },
                ],
            },
        },
        stages: [
            {
                description: "Convince 5 goblins in the Stonebreak Mine to cease their 'musical' activities.",
                requirement: { type: 'kill', monsterId: 'goblin', quantity: 5 },
            },
            {
                description: 'Return to Old Man Fitzwilliam in Meadowdale to report your success.',
                requirement: { type: 'talk', poiId: 'meadowdale_square', npcName: 'Old Man Fitzwilliam' }
            }
        ],
        rewards: {
            xp: [{ skill: SkillName.Attack, amount: 100 }],
            coins: 200
        }
    },
    sheep_troubles: {
        id: 'sheep_troubles',
        name: 'Sheep Troubles',
        description: "Rancher McGregor's sheep are getting overgrown. He needs a hand shearing them and preparing the wool.",
        startHint: "Speak to Rancher McGregor at his ranch, west of Meadowdale.",
        startDialogueNode: 'start',
        playerStagePerspectives: [
            "I need to shear 10 sheep in the pen at the ranch.",
            "I need to use the spinning wheel in the barn to turn the 10 pieces of wool into balls of wool.",
            "I should return the 10 balls of wool to Rancher McGregor."
        ],
        completionSummary: "I helped out Rancher McGregor with his overgrown sheep. I sheared ten of them, spun the wool in his barn, and he paid me for the finished balls of wool.",
        dialogue: {
            start: {
                npcName: 'Rancher McGregor',
                npcIcon: '/assets/npcChatHeads/rancher_mcgregor.png',
                text: "Well howdy, partner. Good of you to stop by. I've got a bit of a situation here... my sheep have gotten... well, 'fluffy' is an understatement.",
                responses: [
                    { text: "They do look rather spherical.", next: 'problem' },
                    { text: "Just passing through, thanks.", action: 'close' },
                ],
            },
            problem: {
                npcName: 'Rancher McGregor',
                npcIcon: '/assets/npcChatHeads/rancher_mcgregor.png',
                text: "Spherical! Exactly! It's a woolly catastrophe. My usual shearer is out with a cold, and I can't keep up myself. I need someone to shear ten of 'em for me. The raw wool isn't much use on its own, though.",
                responses: [
                    { text: "What needs to be done with it?", next: 'solution' },
                ],
            },
            solution: {
                npcName: 'Rancher McGregor',
                npcIcon: '/assets/npcChatHeads/rancher_mcgregor.png',
                text: "It needs to be spun into balls of wool. I've got a spinning wheel in the barn you can use. If you can shear ten sheep, spin the wool, and bring me back ten finished balls, I'd be mighty grateful. I'll pay you well for your trouble, of course.",
                responses: [
                    { text: "You've got a deal. I'll get right on it.", action: 'accept_quest' },
                    { text: "That sounds like a lot of work.", action: 'close' },
                ],
            },
        },
        stages: [
            {
                description: 'Shear 10 wool from the sheep in the pen.',
                requirement: { type: 'shear', quantity: 10 },
            },
            {
                description: 'Use the spinning wheel in the barn to create 10 balls of wool.',
                requirement: { type: 'spin', quantity: 10 },
            },
            {
                description: 'Return to Rancher McGregor with the 10 balls of wool.',
                requirement: { type: 'talk', poiId: 'mcgregors_ranch', npcName: 'Rancher McGregor' }
            }
        ],
        rewards: {
            xp: [{ skill: SkillName.Crafting, amount: 150 }],
            coins: 300
        }
    },
    ancient_blade: {
        id: 'ancient_blade',
        name: 'An Ancient Blade',
        description: "A rusty sword found by chance might be restorable by a master smith.",
        isHidden: true,
        startHint: "This is a hidden quest. It is started by showing a Rusty Iron Sword to Valerius the smith.",
        playerStagePerspectives: [
            "I should show this rusty sword to Valerius the smith.",
            "Valerius needs 5 Iron Ore to restore the sword.",
            "I should talk to Valerius now that I've given him the ore."
        ],
        completionSummary: "I found a rusty old sword and took it to Valerius. With some iron ore I provided, he was able to restore it to a fine Iron Sword for me.",
        stages: [
            {
                description: 'Show the Rusty Iron Sword to Valerius the Master Smith in Meadowdale.',
                requirement: { type: 'talk', poiId: 'meadowdale_smithy', npcName: 'Valerius the Master Smith' }
            },
            {
                description: 'Bring 5 Iron Ore to Valerius to restore the sword.',
                requirement: { type: 'gather', itemId: 'iron_ore', quantity: 5 }
            },
            {
                description: 'Talk to Valerius to receive your restored sword.',
                requirement: { type: 'talk', poiId: 'meadowdale_smithy', npcName: 'Valerius the Master Smith' }
            }
        ],
        rewards: {
            xp: [{ skill: SkillName.Smithing, amount: 250 }],
            items: [{ itemId: 'iron_sword', quantity: 1 }],
        }
    },
    bandit_toll: {
        id: 'bandit_toll',
        name: 'Bandit Toll',
        description: "The road to the southern town of Oakhaven is plagued by bandits, disrupting trade. The clerk in Meadowdale's town hall is offering a reward for clearing them out.",
        startHint: "Speak to Clerk Augustus in the Meadowdale Town Hall about the trouble on the southern road.",
        startDialogueNode: 'start',
        playerStagePerspectives: [
            "I need to defeat 5 of the Cloaked Bandits on the road to Oakhaven.",
            "I should return to Clerk Augustus in Meadowdale to claim my reward."
        ],
        completionSummary: "I cleared out the bandits who were blocking the road to Oakhaven. With the trade route reopened, Clerk Augustus paid me a handsome bounty.",
        dialogue: {
            start: {
                npcName: 'Clerk Augustus',
                npcIcon: '/assets/npcChatHeads/clerk_augustus.png',
                text: "Another adventurer looking for work, I presume? The road south to Oakhaven has become impassable. A group of brazen bandits has taken up residence, demanding a 'toll' from anyone who passes.",
                responses: [
                    { text: "What's the situation?", next: 'situation' },
                    { text: "I'm not interested in road maintenance.", action: 'close' },
                ],
            },
            situation: {
                npcName: 'Clerk Augustus',
                npcIcon: '/assets/npcChatHeads/clerk_augustus.png',
                text: "They've choked off trade with the south. Oakhaven is a crafting town, and their goods aren't reaching us. We need someone to... persuade these thugs to move on. Violently.",
                responses: [
                    { text: "What's the pay?", next: 'job' },
                ],
            },
            job: {
                npcName: 'Clerk Augustus',
                npcIcon: '/assets/npcChatHeads/clerk_augustus.png',
                text: "The town council has authorized a bounty. Take out five of their number, and I'll see to it you're rewarded handsomely. More importantly, the road to Oakhaven will be open again. Are you up to the task?",
                responses: [
                    { text: "Consider it done. I'll clear the road.", action: 'accept_quest' },
                    { text: "I'd rather not get my hands dirty.", action: 'close' },
                ],
            },
        },
        stages: [
            {
                description: 'Defeat 5 Cloaked Bandits on the road to Oakhaven.',
                requirement: { type: 'kill', monsterId: 'cloaked_bandit', quantity: 5 },
            },
            {
                description: 'Return to Clerk Augustus at the Town Hall in Meadowdale to claim your reward.',
                requirement: { type: 'talk', poiId: 'town_hall', npcName: 'Clerk Augustus' }
            }
        ],
        rewards: {
            xp: [{ skill: SkillName.Strength, amount: 200 }],
            coins: 500,
        }
    },
    magical_runestone_discovery: {
        id: 'magical_runestone_discovery',
        name: "Magical Runestone Discovery",
        description: "Wizard Elmsworth in the Meadowdale Library has made a discovery about the nature of magic and needs an adventurer to help him investigate.",
        startHint: "Speak to Wizard Elmsworth in the Meadowdale Library.",
        playerStagePerspectives: [
            "I've agreed to help Wizard Elmsworth. I should speak to him again to be teleported to his discovery.",
            "I'm at the location Wizard Elmsworth teleported me to. I should speak to him again.",
            "I need to mine 5 chunks of Rune Essence for the wizard.",
            "I have the essence. I should return to Wizard Elmsworth in the Meadowdale Library.",
            "Elmsworth gave me a strange trinket that vibrates near the essence. He said it's pulling north, past the Murky Riverbank. I need to investigate where it leads.",
            "The trinket led me to an altar! It reacted strongly. I should report this back to Wizard Elmsworth.",
            "Elmsworth thinks the items need to be used on the altar. I should return and try it.",
            "I've crafted runes! I should report my success to Wizard Elmsworth."
        ],
        completionSummary: "I assisted Wizard Elmsworth in his research. He discovered a mine filled with Rune Essence and a strange Talisman. I followed the Talisman's pull to a hidden altar, and under Elmsworth's guidance, used it to craft the essence into runes, discovering the lost art of Runecrafting.",
        stages: [
            {
                description: "Agree to help Wizard Elmsworth.",
                requirement: { type: 'talk', poiId: 'meadowdale_library', npcName: 'Wizard Elmsworth' }
            },
            {
                description: "Be teleported by Wizard Elmsworth.",
                requirement: { type: 'talk', poiId: 'meadowdale_library', npcName: 'Wizard Elmsworth' }
            },
            {
                description: "Mine 5 Rune Essence chunks.",
                requirement: { type: 'gather', itemId: 'rune_essence', quantity: 5 }
            },
            {
                description: "Return to Wizard Elmsworth in Meadowdale.",
                requirement: { type: 'talk', poiId: 'meadowdale_library', npcName: 'Wizard Elmsworth' },
                stageRewards: {
                    items: [{ itemId: 'gust_talisman', quantity: 1 }, { itemId: 'rune_essence', quantity: 5 }]
                }
            },
            {
                description: "Find the source of the talisman's pull.",
                requirement: { type: 'talk', poiId: 'gust_altar', npcName: 'Approach the altar' }
            },
            {
                description: "Report your findings to Wizard Elmsworth.",
                requirement: { type: 'talk', poiId: 'meadowdale_library', npcName: 'Wizard Elmsworth' }
            },
            {
                description: "Use the Talisman and Rune Essence on the Gust Altar.",
                requirement: { type: 'talk', poiId: 'gust_altar', npcName: 'Approach the altar' }
            },
            {
                description: "Return to Wizard Elmsworth with the runes.",
                requirement: { type: 'talk', poiId: 'meadowdale_library', npcName: 'Wizard Elmsworth' }
            }
        ],
        rewards: {
            xp: [{ skill: SkillName.Runecrafting, amount: 250 }],
            coins: 500,
            items: [
                { itemId: 'binding_talisman', quantity: 1 },
            ]
        }
    },
    capitals_call: {
        id: 'capitals_call',
        name: "The Capital's Call",
        description: "The road to the capital, Silverhaven, is blocked. A guard captain in Oakhaven needs help reopening the route.",
        startHint: "Speak to Guard Captain Elara at the Oakhaven West Gate about the road to the capital.",
        playerStagePerspectives: [
            "The bridge to the west is broken. I need to gather 20 Logs and 5 pieces of Rope to help repair it.",
            "I have the supplies. I should return to Guard Captain Elara."
        ],
        completionSummary: "The bridge on the King's Road was out, blocking the way to the capital. I gathered logs and rope for the Oakhaven guard, who were then able to repair it, reopening the path west.",
        stages: [
            {
                description: "The bridge on the King's Road is out. Gather 20 Logs and 5 pieces of Rope to repair it.",
                requirement: { type: 'gather', itemId: 'logs', quantity: 20 }
            },
            {
                description: "Return to Guard Captain Elara at the Oakhaven West Gate.",
                requirement: { type: 'talk', poiId: 'oakhaven_west_gate', npcName: 'Guard Captain Elara' }
            }
        ],
        rewards: {
            xp: [{ skill: SkillName.Crafting, amount: 500 }, { skill: SkillName.Woodcutting, amount: 500 }],
            coins: 1000,
        }
    },
    lost_heirloom: {
        id: 'lost_heirloom',
        name: "Lost Heirloom",
        description: "You found a beautiful old necklace. Perhaps someone in the capital city of Silverhaven is missing it.",
        isHidden: true,
        startHint: "This is a hidden quest. It is started by finding a special necklace and showing it to the right person.",
        playerStagePerspectives: [
            "I found an old necklace. I should try to find its owner in the capital city of Silverhaven."
        ],
        completionSummary: "I found an old heirloom necklace on my travels. I managed to track down its owner, a woman named Elara, in Silverhaven's residential district. She was overjoyed to have it back.",
        stages: [
            {
                description: "Find the owner of the lost heirloom.",
                requirement: { type: 'talk', poiId: 'silverhaven_residential_district', npcName: 'Elara' }
            }
        ],
        rewards: {
            xp: [{ skill: SkillName.Slayer, amount: 350 }],
            coins: 1500,
        }
    },
};

export const REPEATABLE_QUEST_POOL: RepeatableQuest[] = [
    // --- GATHER ---
    {
        id: 'gather_logs_meadowdale',
        type: 'gather',
        title: 'Restock the Woodpile',
        description: "The innkeeper needs more logs for the fire. Bring him a bundle of standard logs.",
        location: 'meadowdale',
        target: { itemId: 'logs' },
        baseCoinReward: 5,
        xpReward: { skill: SkillName.Woodcutting, amount: 5 },
    },
    {
        id: 'gather_ore_meadowdale',
        type: 'gather',
        title: 'Ore for the Smithy',
        description: "The smithy is running low on basic ore for training new apprentices. Provide some copper ore.",
        location: 'meadowdale',
        target: { itemId: 'copper_ore' },
        baseCoinReward: 8,
        xpReward: { skill: SkillName.Mining, amount: 4 },
    },
    {
        id: 'gather_shrimp_meadowdale',
        type: 'gather',
        title: "Chef's Request: Shrimp",
        description: "The local chef needs fresh shrimp for a new recipe. They'll pay for any you can bring.",
        location: 'meadowdale',
        target: { itemId: 'raw_shrimp' },
        baseCoinReward: 6,
        xpReward: { skill: SkillName.Fishing, amount: 3 },
    },
    {
        id: 'gather_wool_oakhaven',
        type: 'gather',
        title: 'Wool for the Weavers',
        description: "Oakhaven's weavers are always in need of wool for their fine crafts. Shear some sheep and bring it in.",
        location: 'oakhaven',
        target: { itemId: 'wool' },
        baseCoinReward: 4,
        xpReward: { skill: SkillName.Crafting, amount: 2 },
    },
    // --- KILL ---
    {
        id: 'kill_rats_meadowdale',
        type: 'kill',
        title: 'Cellar Infestation',
        description: "Giant rats have infested the tavern's cellar. Clear them out.",
        location: 'meadowdale',
        target: { monsterId: 'giant_rat' },
        baseCoinReward: 20,
        xpReward: { skill: SkillName.Attack, amount: 10 },
    },
    {
        id: 'kill_goblins_meadowdale',
        type: 'kill',
        title: 'Mine Mischief',
        description: 'Goblins are causing trouble in the Stonebreak Mine again. Thin their numbers.',
        location: 'meadowdale',
        target: { monsterId: 'goblin' },
        baseCoinReward: 30,
        xpReward: { skill: SkillName.Strength, amount: 15 },
    },
    {
        id: 'kill_spiders_oakhaven',
        type: 'kill',
        title: 'Farmstead Frights',
        description: 'Giant spiders have taken over the abandoned farmstead south of Meadowdale. It needs to be cleared for safety.',
        location: 'oakhaven',
        target: { monsterId: 'giant_spider' },
        baseCoinReward: 50,
        xpReward: { skill: SkillName.Defence, amount: 20 },
    },
    // --- INTERACT ---
    {
        id: 'interact_clean_tavern_meadowdale',
        type: 'interact',
        title: 'Tidy the Tavern',
        description: "The Rusty Flagon is a mess after a busy night. Help the barkeep clean up.",
        location: 'meadowdale',
        locationPoiId: 'the_rusty_flagon',
        target: { name: 'Tidy the Tavern' },
        baseCoinReward: 100,
        xpReward: { skill: SkillName.Strength, amount: 50 },
    },
    {
        id: 'interact_sharpen_tools_oakhaven',
        type: 'interact',
        title: 'Sharpen Crafting Tools',
        description: "The artisans in Oakhaven need their tools sharpened. It's tedious work, but someone's got to do it.",
        location: 'oakhaven',
        locationPoiId: 'oakhaven_crafting_district',
        target: { name: 'Sharpen Tools' },
        baseCoinReward: 250,
        xpReward: { skill: SkillName.Crafting, amount: 100 },
    },
];
