import { Quest, SkillName } from '../../types';

export const theSorcerersTrial: Quest = {
    id: 'the_sorcerers_trial',
    name: "The Sorcerer's Trial",
    isHidden: true,
    description: "Librarian Anya has uncovered a rite of communion with the God of Sorcery, requiring a demonstration of magical mastery in three forms: Creation, Destruction, and Transmutation.",
    startHint: "Speak to Librarian Anya in the Sanctity Library after completing 'The Saint's First Step'.",
    playerStagePerspectives: [
        "Anya has set me on the Sorcerer's Trial. First, I must demonstrate Creation by crafting 100 Passage Runes at once.",
        "I have crafted the Passage Runes.",
        "Next, I must demonstrate Destruction. Anya has sent me to Zafira in Fouthia to learn how to imbue an item with destructive energy.",
        "Zafira requires a Wyvern Claw and 10 Brimstone to perform the imbuement.",
        "I have the materials for Zafira.",
        "I have the Imbued Wyvern Claw.",
        "Finally, for Transmutation, I must use the 'Greater Transmutation' spell on a Runic Bar.",
        "I have proven my mastery over the three forms of magic. I should return to Anya.",
        "Anya has instructed me to take the three foci—the Passage Runes, the Imbued Claw, and the memory of my transmutation—to the Elemental Shrine in the Wyrmwood Grove.",
        "I am at the shrine. I should place the foci on the altar.",
        "The foci have summoned the Avatar of Sorcery!",
        "I must defeat the Avatar of Sorcery.",
        "The Avatar is defeated. I have been granted a vision of pure magical defense.",
        "I should return to Librarian Anya with news of my success."
    ],
    completionSummary: "I completed the Sorcerer's Trial for Librarian Anya. By demonstrating mastery over Creation, Destruction, and Transmutation, I summoned and defeated the Avatar of Sorcery. My reward was the powerful knowledge of Protection from Magic.",
    stages: [
        { description: "Craft 100 Passage Runes in a single action.", requirement: { type: 'gather', items: [{ itemId: 'passage_rune', quantity: 100 }] } },
        { description: "Speak to Zafira in Fouthia.", requirement: { type: 'talk', poiId: 'fouthia_alchemist', npcName: 'Zafira the Alchemist' } },
        { description: "Gather 1 Wyvern Claw and 10 Brimstone.", requirement: { type: 'gather', items: [{ itemId: 'wyvern_claw', quantity: 1 }, { itemId: 'brimstone', quantity: 10 }] } },
        { description: "Return to Zafira.", requirement: { type: 'talk', poiId: 'fouthia_alchemist', npcName: 'Zafira the Alchemist' } },
        { description: "Receive the Imbued Wyvern Claw.", requirement: { type: 'gather', items: [{ itemId: 'imbued_wyvern_claw', quantity: 1 }] } },
        { description: "Use Greater Transmutation on a Runic Bar.", requirement: { type: 'talk', poiId: 'any', npcName: 'Perform Transmutation' } }, // Special requirement type
        { description: "Return to Librarian Anya.", requirement: { type: 'talk', poiId: 'sanctity_library', npcName: 'Librarian Anya' } },
        { description: "Go to the Elemental Shrine in the Wyrmwood Grove.", requirement: { type: 'talk', poiId: 'wg_elemental_shrine', npcName: 'Place Foci' } },
        { description: "Prepare to fight the Avatar of Sorcery.", requirement: { type: 'talk', poiId: 'wg_elemental_shrine', npcName: 'Face the Avatar' } },
        { description: "Defeat the Avatar of Sorcery.", requirement: { type: 'kill', monsterId: 'avatar_of_sorcery', quantity: 1 } },
        { description: "Return to Librarian Anya.", requirement: { type: 'talk', poiId: 'sanctity_library', npcName: 'Librarian Anya' } }
    ],
    rewards: {
        xp: [{ skill: SkillName.Magic, amount: 25000 }, { skill: SkillName.Runecrafting, amount: 5000 }],
        coins: 15000,
        // Unlocks Protect from Magic
    },
};
