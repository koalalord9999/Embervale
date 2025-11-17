import { Quest, SkillName } from '../../types';

export const theTrialOfWar: Quest = {
    id: 'the_trial_of_war',
    name: "The Trial of War",
    isHidden: true,
    description: "Guard Captain Cassia has challenged you to prove your worth to the God of War by undertaking a trial of Strength, Discipline, and Sacrifice.",
    startHint: "Speak to Guard Captain Cassia at the Sanctity West Gate after completing 'The Saint's First Step'.",
    playerStagePerspectives: [
        "Cassia has sent me to an Ancient Dueling Ground in the Sunbright Plains to begin the Trial of War.",
        "I found an inscription at the dueling ground. I should show it to Librarian Anya in Sanctity.",
        "Anya translated the inscription. I must present three offerings: a symbol of Strength, Discipline, and Sacrifice.",
        "For Strength, I must slay a mighty Glacial Bear in the Frostfang Peaks and claim its heart.",
        "For Discipline, I must forge a masterpiece. Valerius the Smith in Meadowdale can provide the plans.",
        "Valerius has given me the plans for a Ceremonial Greatsword. I need 5 Mithril Bars to forge it.",
        "I have forged the Ceremonial Greatsword.",
        "For Sacrifice, I must offer a flawless gem. I need to obtain a cut Diamond.",
        "I have all three offerings. I must return to the Ancient Dueling Ground and place them on the pedestals.",
        "I have placed the offerings. The ground trembles as the Avatar of War appears.",
        "I must defeat the Avatar of War.",
        "I have defeated the Avatar. A vision granted me newfound defensive knowledge.",
        "I should report my success to Guard Captain Cassia."
    ],
    completionSummary: "I completed the Trial of War. By offering the heart of a great beast, a masterfully smithed blade, and a flawless diamond, I summoned and defeated the Avatar of War. In victory, I was granted the knowledge of Protection from Melee.",
    stages: [
        { description: "Go to the Ancient Dueling Ground.", requirement: { type: 'talk', poiId: 'sp_ancient_dueling_ground', npcName: 'Examine Inscription' } },
        { description: "Speak to Librarian Anya in Sanctity.", requirement: { type: 'talk', poiId: 'sanctity_library', npcName: 'Librarian Anya' } },
        { description: "Slay a Glacial Bear and obtain its Heart.", requirement: { type: 'gather', items: [{ itemId: 'frozen_bear_heart', quantity: 1 }] } },
        { description: "Speak to Valerius in Meadowdale.", requirement: { type: 'talk', poiId: 'meadowdale_smithy', npcName: 'Valerius the Master Smith' } },
        { description: "Gather 5 Runic Bars.", requirement: { type: 'gather', items: [{ itemId: 'mithril_bar', quantity: 5 }] } },
        { description: "Smith the Ceremonial Greatsword.", requirement: { type: 'smith', itemId: 'ceremonial_greatsword', quantity: 1 } },
        { description: "Obtain a cut Diamond.", requirement: { type: 'gather', items: [{ itemId: 'diamond', quantity: 1 }] } },
        { description: "Return to the Ancient Dueling Ground.", requirement: { type: 'talk', poiId: 'sp_ancient_dueling_ground', npcName: 'Place Offerings' } },
        { description: "Prepare to fight the Avatar of War.", requirement: { type: 'talk', poiId: 'sp_ancient_dueling_ground', npcName: 'Face the Avatar' } },
        { description: "Defeat the Avatar of War.", requirement: { type: 'kill', monsterId: 'avatar_of_war', quantity: 1 } },
        { description: "Return to Guard Captain Cassia.", requirement: { type: 'talk', poiId: 'sanctity_west_gate', npcName: 'Guard Captain Cassia' } },
    ],
    rewards: {
        xp: [{ skill: SkillName.Attack, amount: 10000 }, { skill: SkillName.Strength, amount: 10000 }, { skill: SkillName.Defence, amount: 10000 }],
        coins: 15000,
        // Unlocks Protect from Melee
    },
};
