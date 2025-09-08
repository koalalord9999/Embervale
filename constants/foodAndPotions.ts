import { Item, SkillName } from '../types';

export const foodAndPotions: Item[] = [
    // Raw Food
    { id: 'raw_shrimp', name: 'Raw Shrimp', description: 'A freshly caught shrimp.', stackable: false, value: 3, iconUrl: 'https://api.iconify.design/game-icons:shrimp.svg', material: 'raw-fish' },
    { id: 'raw_sardine', name: 'Raw Sardine', description: 'A small, oily fish.', stackable: false, value: 5, iconUrl: 'https://api.iconify.design/game-icons:fish-cooked.svg', material: 'raw-fish' },
    { id: 'giant_crab_meat', name: 'Giant Crab Meat', description: 'A chunk of raw meat from a giant crab.', stackable: false, value: 10, iconUrl: 'https://api.iconify.design/game-icons:crab-claw.svg', material: 'raw-fish' },
    { id: 'raw_herring', name: 'Raw Herring', description: 'A common sea fish.', stackable: false, value: 10, iconUrl: 'https://api.iconify.design/game-icons:fish-cooked.svg', material: 'raw-fish' },
    { id: 'raw_chicken', name: 'Raw Chicken', description: 'Needs to be cooked.', stackable: false, value: 5, iconUrl: 'https://api.iconify.design/game-icons:chicken-leg.svg', material: 'raw-meat' },
    { id: 'raw_beef', name: 'Raw Beef', description: 'A slab of raw beef, needs to be cooked.', stackable: false, value: 8, iconUrl: 'https://api.iconify.design/game-icons:meat.svg', material: 'raw-meat' },
    { id: 'raw_boar_meat', name: 'Raw Boar Meat', description: 'A chunk of tough, gamey meat. It needs to be cooked.', stackable: false, value: 10, iconUrl: 'https://api.iconify.design/game-icons:meat.svg', material: 'raw-meat' },
    { id: 'raw_trout', name: 'Raw Trout', description: 'A freshwater fish with a speckled pattern.', stackable: false, value: 25, iconUrl: 'https://api.iconify.design/game-icons:fish-cooked.svg', material: 'raw-fish' },
    { id: 'raw_pike', name: 'Raw Pike', description: 'A large, predatory freshwater fish.', stackable: false, value: 45, iconUrl: 'https://api.iconify.design/game-icons:fish-cooked.svg', material: 'raw-fish' },
    { id: 'raw_eel', name: 'Raw Eel', description: 'A slimy, raw eel. Needs to be cooked.', stackable: false, value: 60, iconUrl: 'https://api.iconify.design/game-icons:eel.svg', material: 'raw-fish' },
    { id: 'rat_kebab_uncooked', name: 'Uncooked Rat Kebab', description: 'A skewered rat tail. It needs to be cooked.', stackable: false, value: 2, iconUrl: 'https://api.iconify.design/game-icons:kebab-spit.svg', material: 'raw-meat' },
    
    // Cooked Food
    { id: 'cooked_shrimp', name: 'Cooked Shrimp', description: 'A nicely cooked shrimp. Heals a small amount of health.', stackable: false, value: 5, iconUrl: 'https://api.iconify.design/game-icons:shrimp.svg', consumable: { healAmount: 3 }, material: 'cooked-fish' },
    { id: 'cooked_sardine', name: 'Cooked Sardine', description: 'A cooked sardine. Heals a small amount of health.', stackable: false, value: 7, iconUrl: 'https://api.iconify.design/game-icons:fish-cooked.svg', consumable: { healAmount: 4 }, material: 'cooked-fish' },
    { id: 'cooked_crab_meat', name: 'Cooked Crab Meat', description: 'Tender crab meat. Heals a decent amount of health.', stackable: false, value: 15, iconUrl: 'https://api.iconify.design/game-icons:crab-claw.svg', consumable: { healAmount: 7 }, material: 'cooked-fish' },
    { id: 'cooked_herring', name: 'Cooked Herring', description: 'A cooked herring. Heals some health.', stackable: false, value: 12, iconUrl: 'https://api.iconify.design/game-icons:fish-cooked.svg', consumable: { healAmount: 6 }, material: 'cooked-fish' },
    { id: 'cooked_chicken', name: 'Cooked Chicken', description: 'A tasty meal. Heals health.', stackable: false, value: 8, iconUrl: 'https://api.iconify.design/game-icons:chicken-leg.svg', consumable: { healAmount: 4 }, material: 'cooked-meat' },
    { id: 'cooked_beef', name: 'Cooked Beef', description: 'A hearty meal. Heals some health.', stackable: false, value: 12, iconUrl: 'https://api.iconify.design/game-icons:steak.svg', consumable: { healAmount: 5 }, material: 'cooked-meat' },
    { id: 'cooked_boar_meat', name: 'Cooked Boar Meat', description: 'A hearty slab of cooked meat that heals a moderate amount of health.', stackable: false, value: 15, iconUrl: 'https://api.iconify.design/game-icons:steak.svg', consumable: { healAmount: 8 }, material: 'cooked-meat' },
    { id: 'cooked_trout', name: 'Cooked Trout', description: 'A nicely cooked trout. Heals a moderate amount of health.', stackable: false, value: 28, iconUrl: 'https://api.iconify.design/game-icons:fish-cooked.svg', consumable: { healAmount: 9 }, material: 'cooked-fish' },
    { id: 'cooked_pike', name: 'Cooked Pike', description: 'A well-cooked pike. Heals a good amount of health.', stackable: false, value: 48, iconUrl: 'https://api.iconify.design/game-icons:fish-cooked.svg', consumable: { healAmount: 12 }, material: 'cooked-fish' },
    { id: 'cooked_eel', name: 'Cooked Eel', description: 'A delicacy that heals a good amount of health.', stackable: false, value: 80, iconUrl: 'https://api.iconify.design/game-icons:eel.svg', consumable: { healAmount: 14 }, material: 'cooked-fish' },
    { id: 'rat_kebab_cooked', name: 'Rat Kebab', description: 'Surprisingly edible. Heals a small amount of health.', stackable: false, value: 4, iconUrl: 'https://api.iconify.design/game-icons:kebab-spit.svg', consumable: { healAmount: 3 }, material: 'cooked-meat' },
    { id: 'serpent_omelet_cooked', name: 'Serpent Omelet', description: 'A surprisingly delicious and hearty omelet. Heals a large amount of health.', stackable: false, value: 250, iconUrl: 'https://api.iconify.design/game-icons:omelette.svg', consumable: { healAmount: 22 }, material: 'cooked-meat' },

    // Burnt Food
    { id: 'burnt_shrimp', name: 'Burnt Shrimp', description: 'You seem to have overcooked this.', stackable: false, value: 0, iconUrl: 'https://api.iconify.design/game-icons:shrimp.svg', material: 'burnt' },
    { id: 'burnt_sardine', name: 'Burnt Sardine', description: 'You seem to have overcooked this.', stackable: false, value: 0, iconUrl: 'https://api.iconify.design/game-icons:fish-cooked.svg', material: 'burnt' },
    { id: 'burnt_herring', name: 'Burnt Herring', description: 'You seem to have overcooked this.', stackable: false, value: 0, iconUrl: 'https://api.iconify.design/game-icons:fish-cooked.svg', material: 'burnt' },
    { id: 'burnt_chicken', name: 'Burnt Chicken', description: 'Crispy, but not in a good way.', stackable: false, value: 0, iconUrl: 'https://api.iconify.design/game-icons:chicken-leg.svg', material: 'burnt' },
    { id: 'burnt_beef', name: 'Burnt Beef', description: 'It\'s... crispy.', stackable: false, value: 0, iconUrl: 'https://api.iconify.design/game-icons:steak.svg', material: 'burnt' },
    { id: 'burnt_boar_meat', name: 'Burnt Boar Meat', description: 'This is probably not edible.', stackable: false, value: 0, iconUrl: 'https://api.iconify.design/game-icons:steak.svg', material: 'burnt' },
    { id: 'burnt_trout', name: 'Burnt Trout', description: 'You seem to have overcooked this.', stackable: false, value: 0, iconUrl: 'https://api.iconify.design/game-icons:fish-cooked.svg', material: 'burnt' },
    { id: 'burnt_pike', name: 'Burnt Pike', description: 'You seem to have overcooked this.', stackable: false, value: 0, iconUrl: 'https://api.iconify.design/game-icons:fish-cooked.svg', material: 'burnt' },
    { id: 'burnt_eel', name: 'Burnt Eel', description: 'A charred, rubbery mess.', stackable: false, value: 0, iconUrl: 'https://api.iconify.design/game-icons:eel.svg', material: 'burnt' },
    { id: 'burnt_crab_meat', name: 'Burnt Crab Meat', description: 'This crab meat is charred beyond recognition.', stackable: false, value: 0, iconUrl: 'https://api.iconify.design/game-icons:crab-claw.svg', material: 'burnt' },
    { id: 'rat_kebab_burnt', name: 'Burnt Rat Kebab', description: 'You cremated the rat tail.', stackable: false, value: 0, iconUrl: 'https://api.iconify.design/game-icons:kebab-spit.svg', material: 'burnt' },
    { id: 'serpent_omelet_burnt', name: 'Burnt Serpent Omelet', description: 'You have ruined a perfectly good, and very rare, egg.', stackable: false, value: 0, iconUrl: 'https://api.iconify.design/game-icons:omelette.svg', material: 'burnt' },
    
    // Potions & Drinks
    { id: 'beer', name: 'Beer', description: 'A frothy mug of ale. Heals a little, but temporarily lowers your Attack level.', stackable: false, value: 2, iconUrl: 'https://api.iconify.design/game-icons:beer-stein.svg', consumable: { healAmount: 1, statModifiers: [ { skill: SkillName.Attack, value: -1, duration: 15000 } ] }, emptyable: { emptyItemId: 'beer_glass' }, material: 'copper' },
    { id: 'bandit_brew', name: 'Bandit\'s Brew', description: 'A rough, potent brew. Temporarily boosts Strength but lowers Defence.', stackable: false, value: 20, iconUrl: 'https://api.iconify.design/game-icons:potion-ball.svg', consumable: { healAmount: 2, statModifiers: [ { skill: SkillName.Strength, value: 2, duration: 30000 }, { skill: SkillName.Defence, value: -2, duration: 30000 } ] }, material: 'ruby' },
    { id: 'vial', name: 'Vial', description: 'An empty glass vial.', stackable: true, value: 2, iconUrl: 'https://api.iconify.design/game-icons:round-potion.svg', material: 'vial' },
    { id: 'vial_of_water', name: 'Vial of Water', description: 'A vial filled with water.', stackable: true, value: 2, iconUrl: 'https://api.iconify.design/game-icons:round-potion.svg', emptyable: { emptyItemId: 'vial' }, material: 'vial-water' },
    // Herblore Potions will be here
];