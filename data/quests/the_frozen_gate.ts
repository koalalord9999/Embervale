
import { Quest } from '../../types';

export const theFrozenGate: Quest = {
    id: 'the_frozen_gate',
    name: 'The Frozen Gate',
    description: "Internal quest to track if the Frozen Gate in Frostfang Peaks has been unlocked.",
    isHidden: true,
    isSuperHidden: true,
    startHint: "Unlocked by using the Frostfang Key on the Frozen Gate.",
    playerStagePerspectives: [],
    completionSummary: "You have permanently unlocked the Frozen Gate.",
    stages: [], // No stages needed, it's just a completion flag
    rewards: {},
};