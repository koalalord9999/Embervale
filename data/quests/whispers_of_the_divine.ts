/**
 * Quest: Whispers of the Divine (Main Quest)
 * ==========================================
 *
 * Synopsis:
 * -----------
 * Following the stabilization of the Arcane Weave in "The Arcane Awakening," Archmage Theron detects
 * a new, subtle layer of energy emanating from high-level runic altars. Believing they hold a deeper
 * purpose than just rune crafting, he creates an "Attuned Locus" and tasks the player with using it at
 * three powerful, remote altars: the Verdant Altar (Nature/Life), the Nexus Altar (Death/Balance),
 * and the Hex Altar (Curses/Control). At each altar, the Locus allows the player to hear a divine
 * "echo"—a cryptic verse from a forgotten god associated with that domain. The player collects these
 * three "Verse Fragments" and returns them to Theron. The archmage deciphers the combined text,
 * revealing a fragment of the world's creation myth concerning these three divine aspects. As a reward,
 * Theron is able to channel the residual divine energy into a cape, allowing the player to choose one
 * of three powerful capes aligned with the aspects they communed with.
 *
 * Why it happened:
 * ----------------
 * The stabilization of the world's magic has made it possible to perceive more ancient and subtle
 * energies. The divine echoes, which have always been present but were previously drowned out by the
 * magical "noise" of the Resonance Cascade, can now be heard by a properly attuned individual using
 * Theron's device.
 *
 * Lore Explained:
 * ---------------
 * - This is a high-level main quest that directly addresses the lore of the gods and the purpose of the altars.
 * - It establishes that the gods of Embrune are not entirely absent but have left behind "echoes" of their
 *   power and consciousness, which are tied to the runecrafting altars.
 * - It reveals that the altars are more than just crafting stations; they are conduits to ancient divine
 *   energies and repositories of forgotten knowledge.
 * - The three aspects explored (Verdant/Nature, Hex/Control, Nexus/Balance) provide a framework for the
 *   world's cosmology and the different types of magic.
 * - The reward (a choice of powerful capes) allows the player to align themselves with one of these divine
 *   aspects, adding a role-playing element and tying game mechanics to lore.
 *
 * Divine Verses Content:
 * ----------------------
 * The following are the three cryptic verses the player receives. These can be used to generate
 * the dialogue when the player receives the fragments and when Theron deciphers them.
 *
 *   1. Verdant Verse (from the Verdant Altar):
 *      "From silent stone, the First Root drank the sun,
 *       Life's green fire, in every leaf and thorn.
 *       The Great Song began, a chorus newly born,
 *       My breath is the wind, my blood the river's run."
 *
 *   2. Nexus Verse (from the Nexus Altar):
 *      "When the Song fades, and the final leaf descends,
 *       To silent dust, all vibrant color blends.
 *       I am the pause, where every story ends,
 *       The patient soil, where new life then depends."
 *
 *   3. Hex Verse (from the Hex Altar):
 *      "Before the Song, there was the single thought,
 *       A pattern drawn, a boundary newly wrought.
 *       I gave the law by which all things are caught,
 *       The binding word, the fate that can't be fought."
 *
 * Approximate Duration:
 * ---------------------
 * Long (60-90 minutes). This is a high-level "messenger" quest. The challenge comes not from new combat
 * encounters introduced by the quest itself, but from the requirement to travel to three separate,
 * dangerous, high-level zones (The Feywood, The Serpent's Coil/Sunken Labyrinth, Whispering Isle Dungeon),
 * implying the player must already be strong enough to survive these locations.
 *
 */
import { Quest, SkillName } from '../../types';

export const whispersOfTheDivine: Quest = {
    id: 'whispers_of_the_divine',
    name: "Whispers of the Divine",
    description: "Archmage Theron has detected strange energies coalescing at the runic altars, suggesting they hold a deeper purpose.",
    isHidden: true,
    startHint: "Speak to Archmage Theron after completing 'The Arcane Awakening'.",
    // Dialogue to be added later
    // startDialogueNode: 'quest_intro_whispers_of_the_divine',
    playerStagePerspectives: [
        "Theron has given me an Attuned Locus to investigate the Verdant Altar, Nexus Altar, and Hex Altar.",
        "I have gathered the three Verse Fragments. I must return them to Theron for deciphering."
    ],
    completionSummary: "Using an Attuned Locus from Theron, I communed with the echoes of forgotten gods at three great altars. I returned their cryptic verses to the Archmage, who deciphered them, revealing a fragment of the world's creation myth. For my service, I was rewarded with a powerful cape embodying one of the divine aspects.",
    stages: [
        {
            description: "Gather the three Verse Fragments from the altars.",
            requirement: { type: 'gather', items: [{ itemId: 'fragment_of_verdant_verse', quantity: 1 }, { itemId: 'fragment_of_nexus_verse', quantity: 1 }, { itemId: 'fragment_of_hex_verse', quantity: 1 }] }
        },
        {
            description: "Return the fragments to Archmage Theron.",
            requirement: { type: 'talk', poiId: 'silverhaven_arcane_wares', npcName: 'Archmage Theron' }
        }
    ],
    rewards: {
        xp: [{ skill: SkillName.Runecrafting, amount: 25000 }, { skill: SkillName.Magic, amount: 15000 }],
        // The choice of cape will be handled in dialogue.
    },
};
