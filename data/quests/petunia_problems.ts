/**
 * Quest: Petunia Problems (Mystery)
 * ========================================
 *
 * Synopsis:
 * -----------
 * Old Man Fitzwilliam's prize-winning petunias in Meadowdale Square are inexplicably dying.
 * The player investigates, taking a soil sample to Herbalist Anise in Oakhaven. Anise, an expert
 * in supernatural ailments, identifies a magical blight. She tasks the player with gathering
 * Grimy Gloom Moss (a reagent that reacts to necrotic magic) to create a revealing potion.
 * Upon returning with the ingredients, Anise brews the 'Blight Ward Potion'. The player uses this
 * potion on the blighted soil patch, which forces a hidden 'Blight Imp' to manifest. After
 * defeating the magical creature, the blight is lifted, and Fitzwilliam rewards the player.
 *
 * Why it happened:
 * ----------------
 * A minor magical creature, a Blight Imp, was drawn to the life energy of the well-tended
 * flowers in the town square. Its presence slowly poisoned the soil with a low-level necrotic blight,
 * causing the plants to wither.
 *
 * Lore Explained:
 * ---------------
 * - Introduces the concept of magical blights and hidden supernatural creatures affecting the world
 *   in subtle ways, even in seemingly safe areas like a town square.
 * - Expands the character of Herbalist Anise beyond a simple shopkeeper, establishing her as an
 *   expert in alchemical and supernatural remedies.
 * - Reinforces the connection between Meadowdale and Oakhaven as neighboring towns with specialized artisans.
 * - Provides a low-level introduction to magic-based problems without requiring the player to be a mage.
 *
 * Approximate Duration:
 * ---------------------
 * Short (15-20 minutes). This involves travel between Meadowdale and Oakhaven, a short monster hunt
 * for a common reagent (Gloom Moss from Cave Slimes), and one quest-specific combat encounter.
 *
 */
import { Quest, SkillName } from '../../types';

export const petuniaProblems: Quest = {
    id: 'petunia_problems',
    name: "Petunia Problems",
    description: "Old Man Fitzwilliam's prize-winning petunias are mysteriously dying, and he's not happy about it. He suspects something unnatural is at play.",
    isHidden: true,
    startHint: "Speak to a distraught Old Man Fitzwilliam in Meadowdale Square.",
    playerStagePerspectives: [
        "Fitzwilliam's petunias are blighted. I should get a soil sample and speak with Herbalist Anise in Oakhaven for her expertise.",
        "Anise needs a sample of Blighted Soil and some Grimy Gloom Moss to create a cure. Gloom Moss grows on Cave Slimes in the Mine Depths.",
        "I have the Blighted Soil and Gloom Moss. I should return to Anise in Oakhaven.",
        "Anise gave me a Blight Ward Potion. I need to use it on the soil patch near Fitzwilliam in Meadowdale Square.",
        "Using the potion summoned a Blight Imp! I need to defeat it.",
        "I defeated the imp. I should tell Fitzwilliam the good news."
    ],
    completionSummary: "I solved the mystery of Fitzwilliam's dying petunias. Anise the Herbalist helped me create a potion which revealed a magical Blight Imp was the culprit. After defeating the creature, the flowers are safe and Fitzwilliam is finally quiet.",
    stages: [
        {
            description: "Speak to Herbalist Anise in Oakhaven.",
            requirement: { type: 'talk', poiId: 'oakhaven_herblore_shop', npcName: 'Herbalist Anise' }
        },
        {
            description: "Gather 1 Blighted Soil and 1 Grimy Gloom Moss.",
            requirement: { type: 'gather', items: [{ itemId: 'blighted_soil', quantity: 1 }, { itemId: 'grimy_gloom_moss', quantity: 1 }] }
        },
        {
            description: "Return to Herbalist Anise.",
            requirement: { type: 'talk', poiId: 'oakhaven_herblore_shop', npcName: 'Herbalist Anise' }
        },
        {
            description: "Use the Blight Ward Potion on the blighted soil in Meadowdale Square.",
            requirement: { type: 'talk', poiId: 'meadowdale_square', npcName: 'Use Blight Ward Potion' }
        },
        {
            description: "Defeat the Blight Imp.",
            requirement: { type: 'kill', monsterId: 'blight_imp', quantity: 1 }
        },
        {
            description: "Report your success to Old Man Fitzwilliam.",
            requirement: { type: 'talk', poiId: 'meadowdale_square', npcName: 'Old Man Fitzwilliam' }
        }
    ],
    rewards: {
        xp: [{ skill: SkillName.Herblore, amount: 500 }],
        coins: 1000,
        items: [{ itemId: 'ring_of_preservation', quantity: 1 }]
    },
    dialogue: {
        petunia_use_potion: {
            npcName: 'Use Blight Ward Potion',
            npcIcon: 'https://api.iconify.design/game-icons:sprout.svg',
            text: "You pour the shimmering potion onto the blighted soil. The ground hisses and a foul-smelling creature tears its way out of the earth!",
            responses: [
                { text: "(Face the creature!)", actions: [{ type: 'take_item', itemId: 'blight_ward_potion', quantity: 1 }, { type: 'advance_quest', questId: 'petunia_problems' }, { type: 'start_mandatory_combat', monsterId: 'blight_imp' }] }
            ]
        }
    }
};