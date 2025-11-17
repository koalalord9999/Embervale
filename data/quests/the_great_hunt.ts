import { Quest, SkillName } from '../../types';

export const theGreatHunt: Quest = {
    id: 'the_great_hunt',
    name: "The Great Hunt",
    isHidden: true,
    description: "Fenris, a master hunter in the Wyrmwood Grove, wishes to guide you in a ritual hunt to honor the God of the Hunt and face its divine Avatar.",
    startHint: "Speak to Fenris at the entrance to the Wyrmwood Grove after completing 'The Saint's First Step'.",
    playerStagePerspectives: [
        "Fenris is teaching me the Great Hunt. I need to gather three 'scents' to create a lure.",
        "Scent of the Predator: I must obtain a Pristine Wolf Pelt from the Alpha Wolf in the Frostfang Peaks.",
        "Scent of the Prey: I must track and hunt the elusive Elder Glimmerhorn Stag in the Sunbright Plains for its Untainted Dust.",
        "Scent of the Sky: I need a Perfect Roc Feather from a mature Roc in the Sunscorched Wastes.",
        "I have all three scents. I should return to Fenris.",
        "Fenris has created the Celestial Lure. He told me to use it at the Hunter's Blind in the Wyrmwood Grove.",
        "I am at the Hunter's Blind. I should use the lure now.",
        "The lure has summoned the Avatar of the Hunt!",
        "I must defeat the Avatar of the Hunt.",
        "The Avatar is defeated. The spirit of the hunt has blessed me with new insight.",
        "I should tell Fenris of my success."
    ],
    completionSummary: "I undertook the Great Hunt under the tutelage of Fenris. By gathering scents from three legendary beasts, I crafted a lure and summoned the Avatar of the Hunt. After a challenging battle, I was granted the knowledge of Protection from Ranged.",
    stages: [
        { description: "Speak to Fenris in the Wyrmwood Grove.", requirement: { type: 'talk', poiId: 'wyrmwood_grove_entrance', npcName: 'Fenris' } },
        { description: "Obtain a Pristine Wolf Pelt.", requirement: { type: 'gather', items: [{ itemId: 'pristine_wolf_pelt', quantity: 1 }] } },
        { description: "Obtain Untainted Glimmerhorn Dust.", requirement: { type: 'gather', items: [{ itemId: 'untainted_glimmerhorn_dust', quantity: 1 }] } },
        { description: "Obtain a Perfect Roc Feather.", requirement: { type: 'gather', items: [{ itemId: 'perfect_roc_feather', quantity: 1 }] } },
        { description: "Return to Fenris with the three scents.", requirement: { type: 'talk', poiId: 'wyrmwood_grove_entrance', npcName: 'Fenris' } },
        { description: "Go to the Hunter's Blind in the Wyrmwood Grove.", requirement: { type: 'talk', poiId: 'wg_hunters_blind', npcName: 'Use Lure' } },
        { description: "Prepare to fight the Avatar of the Hunt.", requirement: { type: 'talk', poiId: 'wg_hunters_blind', npcName: 'Face the Avatar' } },
        { description: "Defeat the Avatar of the Hunt.", requirement: { type: 'kill', monsterId: 'avatar_of_the_hunt', quantity: 1 } },
        { description: "Return to Fenris.", requirement: { type: 'talk', poiId: 'wyrmwood_grove_entrance', npcName: 'Fenris' } }
    ],
    rewards: {
        xp: [{ skill: SkillName.Ranged, amount: 25000 }, { skill: SkillName.Slayer, amount: 5000 }],
        coins: 15000,
        // Unlocks Protect from Ranged
    },
};
