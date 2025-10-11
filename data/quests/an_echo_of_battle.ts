/**
 * Quest: An Echo of Battle (Mystery)
 * ===================================
 *
 * Synopsis:
 * -----------
 * Bronn, a retired adventurer who frequents Oakhaven's tavern, is visibly troubled by old memories.
 * After the player proves their worth (by completing 'The Capital's Call'), he confides in them about
 * a past failure. Years ago, his party sealed a powerful undead knight in a barrow but couldn't
 * destroy it. The key was broken to prevent its reopening. Bronn now fears the seal is weakening.
 * The player investigates the Forgotten Barrow, confirms the seal is active, and takes the key
 * fragments to Valerius in Meadowdale. Valerius, a master smith, reforges the key using Steel Bars
 * provided by the player. The player then enters the barrow, defeats the formidable Grave Revenant Lord,
 * and retrieves its shield, which belonged to Bronn's fallen comrade. Returning the shield to Bronn
 * finally gives the old warrior peace.
 *
 * Why it happened:
 * ----------------
 * The ancient magical seal on the barrow has begun to fade after decades, and the Revenant Lord's
 * malevolent energy is seeping out. This energy has psychically latched onto Bronn, one of the few
 * survivors of the original sealing party, causing nightmares and a palpable sense of dread.
 *
 * Lore Explained:
 * ---------------
 * - Deepens the character of Bronn, establishing him as a once-powerful adventurer with a tragic past,
 *   not just a generic tavern patron.
 * - Introduces the concept of ancient barrows and sealed evils scattered across the world, hinting at
 *   a history of great conflicts and powerful heroes before the player's time.
 * - Provides more lore for Oakhaven and the surrounding Verdant Fields, linking them to a significant
 *   historical event.
 * - Reinforces Valerius's reputation as a master smith capable of reforging ancient and broken artifacts,
 *   connecting the expertise of Meadowdale and Oakhaven.
 *
 * Approximate Duration:
 * ---------------------
 * Medium (30-45 minutes). Requires travel between Oakhaven, Meadowdale, and the Verdant Fields,
 * some resource gathering (Steel Bars), and a challenging mid-level boss fight.
 *
 */
import { Quest, SkillName } from '../../types';

export const anEchoOfBattle: Quest = {
    id: 'an_echo_of_battle',
    name: "An Echo of Battle",
    description: "Bronn, the retired adventurer in Oakhaven's tavern, is troubled by memories of a past battle and a sealed foe.",
    isHidden: true,
    startHint: "Speak to Bronn in The Carved Mug after proving your worth by completing 'The Capital's Call'.",
    // Dialogue to be added later
    // startDialogueNode: 'quest_intro_an_echo_of_battle',
    playerStagePerspectives: [
        "Bronn is worried a sealed enemy has returned. I should investigate the Forgotten Barrow in the Verdant Fields.",
        "The barrow is sealed. Bronn gave me the fragments of a key. I should take them to Valerius the smith in Meadowdale.",
        "Valerius needs 5 Steel Bars to reforge the key.",
        "I have the key. I should return to the Forgotten Barrow and face what's inside.",
        "I defeated the Revenant Lord and found a shield. I should return it to Bronn in Oakhaven."
    ],
    completionSummary: "I helped Bronn the retired adventurer confront his past. After reforging a key with Valerius's help, I entered a forgotten barrow and defeated a powerful Revenant Lord. I returned a shield from the battle to Bronn, finally giving him peace.",
    stages: [
        {
            description: "Investigate the Forgotten Barrow.",
            requirement: { type: 'talk', poiId: 'forgotten_barrow', npcName: 'Examine Seal' }
        },
        {
            description: "Take the Broken Barrow Key to Valerius in Meadowdale.",
            requirement: { type: 'talk', poiId: 'meadowdale_smithy', npcName: 'Valerius the Master Smith' }
        },
        {
            description: "Gather 5 Steel Bars for Valerius.",
            requirement: { type: 'gather', items: [{ itemId: 'steel_bar', quantity: 5 }] }
        },
        {
            description: "Enter the Forgotten Barrow and defeat the Grave Revenant Lord.",
            requirement: { type: 'kill', monsterId: 'grave_revenant_lord', quantity: 1 }
        },
        {
            description: "Return Bronn's Old Shield to him in Oakhaven.",
            requirement: { type: 'talk', poiId: 'the_carved_mug', npcName: 'Bronn the Retired Adventurer' }
        }
    ],
    rewards: {
        xp: [{ skill: SkillName.Attack, amount: 2000 }, { skill: SkillName.Defence, amount: 2000 }],
        items: [{ itemId: 'bronns_shield', quantity: 1 }]
    },
};