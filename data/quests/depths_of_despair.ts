/**
 * Quest: Depths of Despair (Main Quest)
 * =====================================
 *
 * Synopsis:
 * -----------
 * The dwarves at the Dwarven Outpost have been mining a new passage, but their excavations have caused
 * increasingly violent tremors. Durin, the outpost leader, fears a major collapse is imminent and hires
 * the player to investigate the source. The player ventures into the newly discovered "Chasm of Woe,"
 * a cavern system filled with dangerous new creatures like Chasm Crawlers and Rock Golems. Navigating
 * the treacherous paths, the player reaches the heart of the chasm and discovers the source of the
 * tremors: a colossal, ancient elemental golem known as "The Earth-Render," which has been awakened
 * by the mining. The player must defeat this powerful guardian. Upon its defeat, the tremors cease, and
 * the player can recover its crystalline core, the "Heart of the Mountain." Returning this to Durin, the
 * grateful dwarf uses his smithing expertise to fuse it with the player's Runic Pickaxe, creating a
 * powerful, upgraded tool.
 *
 * Why it happened:
 * ----------------
 * Driven by their innate desire to delve deep, the dwarves accidentally broke into a geologically and
 * magically unstable region. Their mining activities disturbed a major nexus of terrestrial energy,
 * awakening its ancient and powerful guardian, The Earth-Render, whose movements were causing the tremors.
 *
 * Lore Explained:
 * ---------------
 * - This quest serves as a main quest line that is independent of the overarching Serpent Bandit plot,
 *   focusing on world-building and elemental lore.
 * - It expands the world downwards, introducing a new, self-contained mid-level dungeon with its own
 *   unique ecosystem of monsters.
 * - It builds upon Dwarven lore, highlighting their ambition, their connection to the earth, and the
 *   potential dangers of "digging too greedily and too deep."
 * - Introduces the concept of powerful, primordial elemental guardians tied to specific locations,
 *   acting as protectors of the natural world.
 *
 * Approximate Duration:
 * ---------------------
 * Medium-Long (45-60 minutes). This quest is designed as a dungeon crawl, requiring the player to
 * fight through several rooms of new mid-level monsters before facing a challenging boss.
 *
 */
import { Quest, SkillName } from '../../types';

export const depthsOfDespair: Quest = {
    id: 'depths_of_despair',
    name: "Depths of Despair",
    description: "The dwarves of the outpost have broken through into a new cavern, but the tremors have worsened and strange creatures are emerging.",
    isHidden: true,
    startHint: "Speak to Durin in the Dwarven Outpost. (Requires Smithing 40).",
    // Dialogue to be added later
    // startDialogueNode: 'quest_intro_depths_of_despair',
    playerStagePerspectives: [
        "Durin is worried about tremors from a new passage in the Outpost Mine. I need to investigate the Chasm of Woe.",
        "I've found a cavern filled with new monsters. I must navigate deeper to find the source of the tremors.",
        "I've found the source: a massive golem called The Earth-Render. I must defeat it.",
        "I defeated the golem and recovered its core, a 'Heart of the Mountain'. I should bring this back to Durin."
    ],
    completionSummary: "I investigated strange tremors for Durin and discovered a new chasm in the mines. At its heart, I defeated a colossal golem, The Earth-Render. Durin used its core to forge my Runic Pickaxe into a powerful Crystal-Tipped Runic Pickaxe and granted me access to a new, rich mining area.",
    stages: [
        {
            description: "Investigate the Chasm of Woe.",
            requirement: { type: 'talk', poiId: 'chasm_of_woe_entrance', npcName: 'Enter the Chasm' }
        },
        {
            description: "Navigate to the heart of the chasm.",
            requirement: { type: 'talk', poiId: 'earth_render_lair', npcName: 'Approach the Golem' }
        },
        {
            description: "Defeat The Earth-Render.",
            requirement: { type: 'kill', monsterId: 'the_earth_render', quantity: 1 }
        },
        {
            description: "Return the Heart of the Mountain to Durin.",
            requirement: { type: 'talk', poiId: 'dwarven_forge', npcName: 'Durin' }
        }
    ],
    rewards: {
        xp: [{ skill: SkillName.Mining, amount: 15000 }, { skill: SkillName.Smithing, amount: 15000 }],
        items: [{ itemId: 'crystal_tipped_runic_pickaxe', quantity: 1 }]
    },
};