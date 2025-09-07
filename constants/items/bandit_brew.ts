
import { Item, SkillName } from '../../types';

export const banditBrew: Item = {
    id: 'bandit_brew',
    name: 'Bandit\'s Brew',
    description: 'A rough, potent brew. Temporarily boosts Strength but lowers Defence.',
    stackable: false,
    value: 20,
    iconUrl: 'https://api.iconify.design/game-icons:potion-ball.svg',
    consumable: {
        healAmount: 2,
        // FIX: Renamed 'debuffs' to 'statModifiers' to match the Item type definition.
        statModifiers: [
            { skill: SkillName.Strength, value: 2, duration: 30000 },
            { skill: SkillName.Defence, value: -2, duration: 30000 }
        ]
    },
    material: 'ruby',
};
