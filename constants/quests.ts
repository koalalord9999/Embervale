
import { Quest, RepeatableQuest, SkillName } from '../types';

export const QUESTS: Record<string, Quest> = {
    goblin_menace: {
        id: 'goblin_menace',
        name: 'Goblin Menace',
        description: "Old Man Fitzwilliam is being driven mad by a racket coming from the Stonebreak Mine. He suspects goblins are to blame.",
        startPoi: 'meadowdale_square',
        startDialogueNode: 'start',
        startHint: "Speak to Old Man Fitzwilliam in the Meadowdale Square.",
        playerStagePerspectives: [
            "I need to take care of 5 goblins in the Stonebreak Mine to stop the racket.",
            "I should let Old Man Fitzwilliam know the goblins have been dealt with."
        ],
        completionSummary: "I dealt with the goblin problem in the mines. The racket has stopped, and Old Man Fitzwilliam paid me for restoring his peace and quiet.",
        dialogue: {
            start: {
                npcName: 'Old Man Fitzwilliam',
                npcIcon: '/assets/npcChatHeads/old_man_fitzwilliam.png',
                text: "My ears! My poor, old ears! Can you hear that infernal racket? It's been going on for days, echoing all the way from the Stonebreak Mine. I haven't had a decent nap in a week!",
                responses: [
                    { text: "What kind of racket?", next: 'racket_explained' },
                    { text: "I'm a bit busy right now.", action: 'close' },
                ],
            },
            racket_explained: {
                npcName: 'Old Man Fitzwilliam',
                npcIcon: '/assets/npcChatHeads/old_man_fitzwilliam.png',
                text: "It's like a thousand tiny hammers wielded by a thousand tiny, angry drummers with no sense of rhythm! And the shrieking! It can only be one thing: goblins. They've taken up residence in the mine, and their... 'music'... is a menace to this whole town's peace and quiet!",
                responses: [
                    { text: "So what do you want me to do about it?", next: 'the_job' },
                ],
            },
            the_job: {
                npcName: 'Old Man Fitzwilliam',
                npcIcon: '/assets/npcChatHeads/old_man_fitzwilliam.png',
                text: "I want you to go in there and... 'encourage' them to practice their percussion elsewhere. Permanently. The town guard is too busy polishing their helmets. If you can clear out a handful of them, maybe they'll get the message. I'll make it worth your while.",
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
        startPoi: 'mcgregors_ranch',
        startDialogueNode: 'start',
        startHint: "Speak to Rancher McGregor at his ranch, west of Meadowdale.",
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
        startPoi: 'meadowdale_smithy',
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
        startPoi: 'town_hall',
        startDialogueNode: 'start',
        startHint: "Speak to Clerk Augustus in the Meadowdale Town Hall about the trouble on the southern road.",
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
    capitals_call: {
        id: 'capitals_call',
        name: "The Capital's Call",
        description: "The road to the capital, Silverhaven, is blocked. A guard captain in Oakhaven needs help reopening the route.",
        startPoi: 'oakhaven_west_gate',
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
        startPoi: 'silverhaven_residential_district',
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
            xp: [{ skill: SkillName.Slayer, amount: 250 }],
            coins: 500,
        }
    },
    missing_shipment: {
        id: 'missing_shipment',
        name: "The Missing Shipment",
        description: "A merchant in Silverhaven is worried about a caravan that never arrived. He suspects foul play on the King's Road.",
        startPoi: 'silverhaven_trade_district',
        startHint: "Speak to Merchant Theron in the Silverhaven Trade District.",
        playerStagePerspectives: [
            "A merchant's caravan was hit by bandits. I need to investigate their hideout on the King's Road and deal with their leader.",
            "I've recovered the goods. I should return them to Merchant Theron in Silverhaven."
        ],
        completionSummary: "A merchant's shipment went missing on the King's Road. I tracked it to a nearby bandit hideout, defeated their leader, and returned the stolen goods to the grateful merchant.",
        stages: [
            {
                description: "Investigate the Bandit Hideout on the King's Road and defeat the Bandit Leader.",
                requirement: { type: 'kill', monsterId: 'bandit_leader', quantity: 1 }
            },
            {
                description: "Return the Stolen Caravan Goods to Merchant Theron in Silverhaven.",
                requirement: { type: 'talk', poiId: 'silverhaven_trade_district', npcName: 'Merchant Theron' }
            }
        ],
        rewards: {
            xp: [{ skill: SkillName.Strength, amount: 750 }],
            coins: 2500,
        }
    },
    a_pinch_of_trouble: {
        id: 'a_pinch_of_trouble',
        name: "A Pinch of Trouble",
        description: "A fisherman on the Isle of Whispers is having problems with oversized crabs.",
        startPoi: 'port_wreckage_docks',
        startDialogueNode: 'start',
        startHint: "Speak to Fisherman Brody on the docks at Port Wreckage.",
        playerStagePerspectives: [
            "The fisherman is being troubled by crabs. I need to defeat 8 of the Giant Crabs on the nearby island.",
            "I need to bring one of the giant claws back to Fisherman Brody as proof.",
            "I have the claw. I should talk to Brody to get my reward."
        ],
        completionSummary: "The crabs on the Isle of Whispers were causing trouble for a local fisherman. I thinned their numbers and brought him back a giant claw as proof, and he rewarded me for my help.",
        dialogue: {
            start: {
                npcName: 'Fisherman Brody',
                npcIcon: '/assets/npcChatHeads/fisherman_brody.png',
                text: "Careful out here, traveler. These isles ain't as peaceful as they look. The crabs... they've gotten bigger. And meaner.",
                responses: [
                    { text: "What's wrong with the crabs?", next: 'problem' },
                    { text: "I can handle a few crabs.", action: 'close' },
                ],
            },
            problem: {
                npcName: 'Fisherman Brody',
                npcIcon: '/assets/npcChatHeads/fisherman_brody.png',
                text: "It's their claws, see? Big as a man's fist! They're cutting my nets and scaring off all the fish. I can't make a living like this. Someone needs to thin their numbers.",
                responses: [
                    { text: "What would it be worth to you?", next: 'job' },
                ],
            },
            job: {
                npcName: 'Fisherman Brody',
                npcIcon: '/assets/npcChatHeads/fisherman_brody.png',
                text: "You look tough enough. If you could take out, say, eight of the big ones on Crabclaw Isle, it'd be a great help. Bring me back one of their giant claws as proof, and I'll make sure you're rewarded for your time.",
                responses: [
                    { text: "I'll take care of your crab problem.", action: 'accept_quest' },
                    { text: "I've got bigger fish to fry.", action: 'close' },
                ],
            },
        },
        stages: [
            {
                description: 'Defeat 8 Giant Crabs on Crabclaw Isle.',
                requirement: { type: 'kill', monsterId: 'giant_crab', quantity: 8 },
            },
            {
                description: "Bring a Giant Crab Claw to Fisherman Brody in Port Wreckage.",
                requirement: { type: 'gather', itemId: 'giant_crab_claw', quantity: 1 }
            },
            {
                description: "Talk to Fisherman Brody to receive your reward.",
                requirement: { type: 'talk', poiId: 'port_wreckage_docks', npcName: 'Fisherman Brody' }
            }
        ],
        rewards: {
            xp: [{ skill: SkillName.Fishing, amount: 200 }],
            coins: 350,
        }
    },
    the_sunken_curse: {
        id: 'the_sunken_curse',
        name: "The Sunken Curse",
        description: "An ancient evil stirs in a labyrinth deep within the island. The elder of Port Wreckage seeks a hero to investigate.",
        startPoi: 'port_wreckage_square',
        startHint: "Speak to Elder Maeve in the Port Wreckage square.",
        playerStagePerspectives: [
            "I need to find a Siren in Siren's Cove and get a lock of its enchanted hair.",
            "I have the hair. Now I need to find pure Brimstone from the volcanic vents.",
            "I have the hair and brimstone. Now I need an Ancient Gear from a sentinel in the labyrinth.",
            "I have all the components. I should take them to Elder Maeve so she can prepare the offering.",
            "I must venture into the Sunken Labyrinth and find the source of the corruption at the temple's heart.",
            "I have cleansed the altar. I should return to Elder Maeve with the news."
        ],
        completionSummary: "I spoke with the elder of Port Wreckage and learned of a growing corruption. I gathered rare components from across the Isle of Whispers, entered the ancient Sunken Labyrinth, and cleansed the central altar, restoring peace to the island.",
        stages: [
            {
                description: "Gather Siren's Hair from a Siren in Siren's Cove.",
                requirement: { type: 'gather', itemId: 'sirens_hair', quantity: 1 }
            },
            {
                description: "Gather Brimstone from the Volcanic Vents.",
                requirement: { type: 'gather', itemId: 'brimstone', quantity: 1 }
            },
            {
                description: "Gather an Ancient Gear from an Ancient Sentinel.",
                requirement: { type: 'gather', itemId: 'ancient_gear', quantity: 1 }
            },
            {
                description: "Return to Elder Maeve with the components.",
                requirement: { type: 'talk', poiId: 'port_wreckage_square', npcName: 'Elder Maeve' }
            },
            {
                description: "Find the central altar in the Sunken Labyrinth and cleanse it.",
                requirement: { type: 'talk', poiId: 'laby_central_altar', npcName: 'Altar of the Depths' }
            },
            {
                description: "Return to Elder Maeve in Port Wreckage.",
                requirement: { type: 'talk', poiId: 'port_wreckage_square', npcName: 'Elder Maeve' }
            }
        ],
        rewards: {
            xp: [{ skill: SkillName.Slayer, amount: 5000 }, { skill: SkillName.Magic, amount: 2500 }],
            coins: 10000,
        }
    }
};

export const REPEATABLE_QUEST_POOL: RepeatableQuest[] = [
    // Meadowdale Gather
    { id: 'rqg_rat_tails', type: 'gather', location: 'meadowdale', title: 'Pest Control', description: 'The innkeeper needs rat tails as proof of a job well done.', target: { itemId: 'rat_tail' }, baseCoinReward: 2, xpReward: { skill: SkillName.Slayer, amount: 5 } },
    { id: 'rqg_goblin_hide', type: 'gather', location: 'meadowdale', title: 'Tanning Supplies', description: 'A local craftsman needs goblin hides for a new project.', target: { itemId: 'goblin_hide' }, baseCoinReward: 5, xpReward: { skill: SkillName.Slayer, amount: 8 } },
    { id: 'rqg_cowhide', type: 'gather', location: 'meadowdale', title: 'Leatherworking Order', description: 'The local tanner has a large order to fill and needs cowhides.', target: { itemId: 'cowhide' }, baseCoinReward: 6, xpReward: { skill: SkillName.Crafting, amount: 4 } },
    { id: 'rqg_logs_smithy', type: 'gather', location: 'meadowdale', title: 'Firewood for the Forge', description: "Valerius the smith needs a steady supply of logs to keep his forge burning hot.", target: { itemId: 'logs' }, baseCoinReward: 1, xpReward: { skill: SkillName.Woodcutting, amount: 3 } },
    { id: 'rqg_shrimp_kitchen', type: 'gather', location: 'meadowdale', title: 'A Fresh Catch', description: "The cook in Meadowdale is planning a seafood stew and needs fresh shrimp.", target: { itemId: 'raw_shrimp' }, baseCoinReward: 2, xpReward: { skill: SkillName.Fishing, amount: 3 } },
    { id: 'rqg_ores_smith', type: 'gather', location: 'meadowdale', title: "A Smith's Foundation", description: "Valerius needs a fresh supply of copper ore to smelt into bronze bars.", target: { itemId: 'copper_ore' }, baseCoinReward: 3, xpReward: { skill: SkillName.Mining, amount: 4 } },
    { id: 'rqg_feathers_fletcher', type: 'gather', location: 'meadowdale', title: 'Fletching Supplies', description: 'A local fletcher is buying feathers in bulk to make arrows.', target: { itemId: 'feathers' }, baseCoinReward: 0.5, xpReward: { skill: SkillName.Fletching, amount: 2 } },
    { id: 'rqg_eggs_inn', type: 'gather', location: 'meadowdale', title: "The Inn's Breakfast", description: 'Barkeep Grimley needs eggs for the morning breakfast rush at the inn.', target: { itemId: 'eggs' }, baseCoinReward: 1, xpReward: { skill: SkillName.Cooking, amount: 5 } },
    
    // Oakhaven Gather & Kill
    { id: 'rqk_bandits', type: 'kill', location: 'oakhaven', title: "Undertaker's Request", description: "The Oakhaven undertaker is paying adventurers to deal with the bandit problem on the roads south of Meadowdale.", target: { monsterId: 'cloaked_bandit' }, baseCoinReward: 20, xpReward: { skill: SkillName.Slayer, amount: 15 } },
    { id: 'rqg_iron_ore_guard', type: 'gather', location: 'oakhaven', title: 'Iron for the Guard', description: "The Oakhaven town guard has placed an order for raw iron ore for new equipment.", target: { itemId: 'iron_ore' }, baseCoinReward: 8, xpReward: { skill: SkillName.Mining, amount: 8 } },
    { id: 'rqg_boar_hide_tanner', type: 'gather', location: 'oakhaven', title: 'Tough Hides Needed', description: "Tanner Sven in Oakhaven needs tough boar hides for some specialty leatherwork.", target: { itemId: 'boar_hide' }, baseCoinReward: 6, xpReward: { skill: SkillName.Crafting, amount: 8 } },
    { id: 'rqg_willow_logs_fletcher', type: 'gather', location: 'oakhaven', title: 'Quality Bows', description: 'A bowyer in Oakhaven is paying well for willow logs to craft quality bows.', target: { itemId: 'willow_logs' }, baseCoinReward: 30, xpReward: { skill: SkillName.Woodcutting, amount: 20 } },

    // General Gather
    { id: 'rqg_spider_silk', type: 'gather', location: 'general', title: 'Silky Smooth', description: 'A tailor is looking for spider silk to make fine clothing.', target: { itemId: 'spider_silk' }, baseCoinReward: 8, xpReward: { skill: SkillName.Crafting, amount: 8 } },

    // Meadowdale Interact
    { id: 'rqi_clean_fountain', type: 'interact', location: 'meadowdale', title: 'Clean the Fountain', description: 'The fountain in Meadowdale Square is looking a bit grimy.', locationPoiId: 'meadowdale_square', target: { name: 'Fountain' }, baseCoinReward: 25, xpReward: { skill: SkillName.Strength, amount: 50 } },
    { id: 'rqi_tidy_tavern_md', type: 'interact', location: 'meadowdale', title: 'Tidy the Tavern', description: 'The Rusty Flagon is a mess after a busy night. Help clean it up.', locationPoiId: 'the_rusty_flagon', target: { name: 'Tavern Floor' }, baseCoinReward: 20, xpReward: { skill: SkillName.Strength, amount: 40 } },
    { id: 'rqi_sweep_smithy', type: 'interact', location: 'meadowdale', title: 'Sweep the Smithy', description: 'The smithy in Meadowdale is covered in soot and metal shavings.', locationPoiId: 'meadowdale_smithy', target: { name: 'Smithy Floor' }, baseCoinReward: 15, xpReward: { skill: SkillName.Strength, amount: 30 } },
    { id: 'rqi_restock_shelves', type: 'interact', location: 'meadowdale', title: 'Restock Shelves', description: 'Help the general store owner in Meadowdale restock the shelves.', locationPoiId: 'meadowdale_square', target: { name: 'General Store Shelves' }, baseCoinReward: 20, xpReward: { skill: SkillName.Strength, amount: 40 } },
    
    // Oakhaven Interact
    { id: 'rqi_polish_well', type: 'interact', location: 'oakhaven', title: 'Polish the Well', description: 'The wishing well in Oakhaven Square could use a good polish.', locationPoiId: 'oakhaven_square', target: { name: 'Wishing Well' }, baseCoinReward: 25, xpReward: { skill: SkillName.Crafting, amount: 50 } },
    { id: 'rqi_tidy_tavern_oh', type: 'interact', location: 'oakhaven', title: 'Tidy the Tavern', description: 'The Carved Mug is a mess after a busy night. Help clean it up.', locationPoiId: 'the_carved_mug', target: { name: 'Tavern Floor' }, baseCoinReward: 20, xpReward: { skill: SkillName.Strength, amount: 40 } },
    { id: 'rqi_sort_tannery', type: 'interact', location: 'oakhaven', title: 'Sort the Tannery', description: "Tanner Sven's workshop is a mess of hides and tools. He needs help organizing.", locationPoiId: 'oakhaven_crafting_district', target: { name: 'Tannery' }, baseCoinReward: 30, xpReward: { skill: SkillName.Crafting, amount: 60 } },

    // Isle of Whispers Gather & Kill
    { id: 'rqk_jungle_stalkers', type: 'kill', location: 'general', title: 'Stalker Hunt', description: 'The shipwright in Port Wreckage needs tough stalker claws for reinforcing hulls.', target: { monsterId: 'jungle_stalker' }, baseCoinReward: 150, xpReward: { skill: SkillName.Slayer, amount: 100 } },
    { id: 'rqg_siren_hair', type: 'gather', location: 'general', title: 'Enchanted Ropes', description: 'An old sailor is buying enchanted siren hair to weave into unsnappable ropes.', target: { itemId: 'sirens_hair' }, baseCoinReward: 200, xpReward: { skill: SkillName.Magic, amount: 50 } },
    { id: 'rqg_brimstone', type: 'gather', location: 'general', title: 'Fuel for the Fire', description: 'The local alchemist requires brimstone for their experiments.', target: { itemId: 'brimstone' }, baseCoinReward: 180, xpReward: { skill: SkillName.Mining, amount: 80 } },
    { id: 'rqk_tidal_crawlers', type: 'kill', location: 'general', title: 'Crawler Cull', description: 'The tidal crawlers are becoming a nuisance on the flats. Thin their numbers.', target: { monsterId: 'tidal_crawler' }, baseCoinReward: 100, xpReward: { skill: SkillName.Slayer, amount: 60 } },
];