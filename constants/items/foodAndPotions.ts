
import { Item, SkillName } from '../../types';

export const foodAndPotions: Item[] = [
    // Raw Food
    { id: 'raw_shrimp', name: 'Raw Shrimp', description: 'A freshly caught shrimp.', stackable: false, value: 3, iconUrl: 'https://api.iconify.design/game-icons:shrimp.svg', material: 'raw-fish' },
    { id: 'raw_sardine', name: 'Raw Sardine', description: 'A small, oily fish.', stackable: false, value: 5, iconUrl: 'https://api.iconify.design/game-icons:fish-cooked.svg', material: 'raw-fish' },
    { id: 'giant_crab_meat', name: 'Giant Crab Meat', description: 'A chunk of raw meat from a giant crab.', stackable: false, value: 10, iconUrl: 'https://api.iconify.design/game-icons:crab-claw.svg', material: 'raw-fish' },
    { id: 'raw_herring', name: 'Raw Herring', description: 'A common sea fish.', stackable: false, value: 10, iconUrl: 'https://api.iconify.design/game-icons:flatfish.svg', material: 'raw-fish' },
    { id: 'raw_anchovy', name: 'Raw Anchovy', description: 'A small, salty fish.', stackable: false, value: 15, iconUrl: 'https://api.iconify.design/game-icons:shrimp.svg', material: 'sapphire' },
    { id: 'raw_chicken', name: 'Raw Chicken', description: 'Needs to be cooked.', stackable: false, value: 5, iconUrl: 'https://api.iconify.design/game-icons:chicken-leg.svg', material: 'raw-meat' },
    { id: 'raw_beef', name: 'Raw Beef', description: 'A slab of raw beef, needs to be cooked.', stackable: false, value: 8, iconUrl: 'https://api.iconify.design/game-icons:meat.svg', material: 'raw-meat' },
    { id: 'raw_boar_meat', name: 'Raw Boar Meat', description: 'A chunk of tough, gamey meat. It needs to be cooked.', stackable: false, value: 10, iconUrl: 'https://api.iconify.design/game-icons:meat.svg', material: 'raw-meat' },
    { id: 'raw_trout', name: 'Raw Trout', description: 'A freshwater fish with a speckled pattern.', stackable: false, value: 25, iconUrl: 'https://api.iconify.design/game-icons:salmon.svg', material: 'raw-fish' },
    { id: 'raw_pike', name: 'Raw Pike', description: 'A large, predatory freshwater fish.', stackable: false, value: 45, iconUrl: 'https://api.iconify.design/game-icons:salmon.svg', material: 'emerald' },
    { id: 'raw_eel', name: 'Raw Eel', description: 'A slimy, raw eel. Needs to be cooked.', stackable: false, value: 60, iconUrl: 'https://api.iconify.design/game-icons:eel.svg', material: 'raw-fish' },
    { id: 'raw_tuna', name: 'Raw Tuna', description: 'A large, powerful fish.', stackable: false, value: 75, iconUrl: 'https://api.iconify.design/game-icons:fried-fish.svg', material: 'raw-fish' },
    { id: 'raw_lobster', name: 'Raw Lobster', description: 'A large crustacean. Needs cooking.', stackable: false, value: 90, iconUrl: 'https://api.iconify.design/game-icons:gecko.svg', material: 'raw-fish' },
    { id: 'raw_swordfish', name: 'Raw Swordfish', description: 'A prized game fish with a long bill.', stackable: false, value: 120, iconUrl: 'https://api.iconify.design/game-icons:dolphin.svg', material: 'raw-fish' },
    { id: 'raw_shark', name: 'Raw Shark', description: 'The meat of a powerful shark.', stackable: false, value: 150, iconUrl: 'https://api.iconify.design/game-icons:shark-jaws.svg', material: 'raw-meat' },
    { id: 'rat_kebab_uncooked', name: 'Uncooked Rat Kebab', description: 'A skewered rat tail. It needs to be cooked.', stackable: false, value: 2, iconUrl: 'https://api.iconify.design/game-icons:kebab-spit.svg', material: 'raw-meat' },
    
    // Cooked Food
    { id: 'sandwich', name: 'Sandwich', description: 'Two slices of bread with something tasty in between. Heals a small amount of health.', stackable: false, value: 10, iconUrl: 'https://api.iconify.design/game-icons:sandwich.svg', consumable: { healAmount: 8 }, material: 'cooked-meat' },
    { id: 'scrambled_eggs', name: 'Scrambled Eggs', description: 'Fluffy scrambled eggs.', stackable: false, value: 3, iconUrl: 'https://api.iconify.design/game-icons:fried-eggs.svg', consumable: { healAmount: 4 }, material: 'cooked-fish' },
    { id: 'cooked_shrimp', name: 'Cooked Shrimp', description: 'A nicely cooked shrimp. Heals a small amount of health.', stackable: false, value: 5, iconUrl: 'https://api.iconify.design/game-icons:shrimp.svg', consumable: { healAmount: 3 }, material: 'cooked-fish' },
    { id: 'cooked_sardine', name: 'Cooked Sardine', description: 'A cooked sardine. Heals a small amount of health.', stackable: false, value: 7, iconUrl: 'https://api.iconify.design/game-icons:fried-fish.svg', consumable: { healAmount: 3 }, material: 'cooked-fish' },
    { id: 'cooked_crab_meat', name: 'Cooked Crab Meat', description: 'Tender crab meat. Heals a decent amount of health.', stackable: false, value: 15, iconUrl: 'https://api.iconify.design/game-icons:crab-claw.svg', consumable: { healAmount: 5 }, material: 'cooked-fish' },
    { id: 'cooked_herring', name: 'Cooked Herring', description: 'A cooked herring. Heals some health.', stackable: false, value: 12, iconUrl: 'https://api.iconify.design/game-icons:flatfish.svg', consumable: { healAmount: 5 }, material: 'cooked-fish' },
    { id: 'cooked_anchovy', name: 'Cooked Anchovy', description: 'A small cooked fish. Tasty on pizza.', stackable: false, value: 15, iconUrl: 'https://api.iconify.design/game-icons:shrimp.svg', consumable: { healAmount: 1 }, material: 'uncut-sapphire' },
    { id: 'cooked_chicken', name: 'Cooked Chicken', description: 'A tasty meal. Heals health.', stackable: false, value: 8, iconUrl: 'https://api.iconify.design/game-icons:chicken-leg.svg', consumable: { healAmount: 3 }, material: 'cooked-meat' },
    { id: 'cooked_beef', name: 'Cooked Beef', description: 'A hearty meal. Heals some health.', stackable: false, value: 12, iconUrl: 'https://api.iconify.design/game-icons:steak.svg', consumable: { healAmount: 3 }, material: 'cooked-meat' },
    { id: 'cooked_boar_meat', name: 'Cooked Boar Meat', description: 'A hearty slab of cooked meat that heals a moderate amount of health.', stackable: false, value: 15, iconUrl: 'https://api.iconify.design/game-icons:steak.svg', consumable: { healAmount: 5 }, material: 'cooked-meat' },
    { id: 'cooked_trout', name: 'Cooked Trout', description: 'A nicely cooked trout. Heals a moderate amount of health.', stackable: false, value: 28, iconUrl: 'https://api.iconify.design/game-icons:salmon.svg', consumable: { healAmount: 7 }, material: 'cooked-fish' },
    { id: 'cooked_pike', name: 'Cooked Pike', description: 'A well-cooked pike. Heals a good amount of health.', stackable: false, value: 48, iconUrl: 'https://api.iconify.design/game-icons:salmon.svg', consumable: { healAmount: 8 }, material: 'uncut-emerald' },
    { id: 'cooked_eel', name: 'Cooked Eel', description: 'A delicacy that heals a good amount of health.', stackable: false, value: 80, iconUrl: 'https://api.iconify.design/game-icons:eel.svg', consumable: { healAmount: 9 }, material: 'cooked-fish' },
    { id: 'molten_eel', name: 'Molten Eel', description: 'An eel that has adapted to live in lava. It\'s already cooked. Heals 13 health.', stackable: false, value: 110, iconUrl: 'https://api.iconify.design/game-icons:eel.svg', consumable: { healAmount: 13 }, material: 'rune-ember' },
    { id: 'cooked_tuna', name: 'Cooked Tuna', description: 'A hearty steak of tuna.', stackable: false, value: 85, iconUrl: 'https://api.iconify.design/game-icons:fried-fish.svg', consumable: { healAmount: 10 }, material: 'cooked-fish' },
    { id: 'cooked_lobster', name: 'Cooked Lobster', description: 'A delicious cooked lobster.', stackable: false, value: 100, iconUrl: 'https://api.iconify.design/game-icons:gecko.svg', consumable: { healAmount: 12 }, material: 'cooked-fish' },
    { id: 'cooked_swordfish', name: 'Cooked Swordfish', description: 'A cooked swordfish steak.', stackable: false, value: 130, iconUrl: 'https://api.iconify.design/game-icons:dolphin.svg', consumable: { healAmount: 14 }, material: 'cooked-fish' },
    { id: 'cooked_shark', name: 'Cooked Shark', description: 'A cooked shark steak. Heals a lot of health.', stackable: false, value: 160, iconUrl: 'https://api.iconify.design/game-icons:shark-jaws.svg', consumable: { healAmount: 20 }, material: 'cooked-meat' },
    { id: 'rat_kebab_cooked', name: 'Rat Kebab', description: 'Surprisingly edible. Heals a small amount of health.', stackable: false, value: 4, iconUrl: 'https://api.iconify.design/game-icons:kebab-spit.svg', consumable: { healAmount: 3 }, material: 'cooked-meat' },
    { id: 'serpent_omelet_cooked', name: 'Serpent Omelet', description: 'A surprisingly delicious and hearty omelet. Heals a large amount of health.', stackable: false, value: 250, iconUrl: 'https://api.iconify.design/game-icons:fried-eggs.svg', consumable: { healAmount: 14 }, material: 'adamantite' },
    { id: 'bread', name: 'Bread', description: 'A simple loaf of bread.', stackable: false, value: 8, iconUrl: 'https://api.iconify.design/game-icons:bread.svg', consumable: { healAmount: 5 }, material: 'cooked-fish' },

    // CAKES
    { id: 'cake', name: 'Cake', description: 'A delicious sponge cake. Heals 4 health.', stackable: false, value: 40, iconUrl: 'https://api.iconify.design/game-icons:cake-slice.svg', consumable: { healAmount: 4 }, material: 'cooked-fish' },
    { id: '2_3_cake', name: '2/3 Cake', description: 'Two thirds of a cake. Heals 4 health.', stackable: false, value: 25, iconUrl: 'https://api.iconify.design/game-icons:cake-slice.svg', consumable: { healAmount: 4 }, material: 'cooked-fish' },
    { id: 'slice_of_cake', name: 'Slice of Cake', description: 'A slice of cake. Heals 4 health.', stackable: false, value: 15, iconUrl: 'https://api.iconify.design/game-icons:cake-slice.svg', consumable: { healAmount: 4 }, material: 'cooked-fish' },

    // PIES
    { id: 'berry_pie', name: 'Berry Pie', description: 'A delicious berry pie.', stackable: false, value: 30, iconUrl: 'https://api.iconify.design/game-icons:pie-slice.svg', consumable: { healAmount: 5 }, material: 'raw-meat' },
    { id: 'half_berry_pie', name: 'Half Berry Pie', description: 'Half of a berry pie.', stackable: false, value: 15, iconUrl: 'https://api.iconify.design/game-icons:pie-slice.svg', consumable: { healAmount: 5 }, material: 'raw-meat' },
    { id: 'apple_pie', name: 'Apple Pie', description: 'A sweet apple pie.', stackable: false, value: 40, iconUrl: 'https://api.iconify.design/game-icons:pie-slice.svg', consumable: { healAmount: 7 }, material: 'adamantite' },
    { id: 'half_apple_pie', name: 'Half Apple Pie', description: 'Half of an apple pie.', stackable: false, value: 20, iconUrl: 'https://api.iconify.design/game-icons:pie-slice.svg', consumable: { healAmount: 7 }, material: 'adamantite' },
    { id: 'meat_pie', name: 'Meat Pie', description: 'A savory meat pie.', stackable: false, value: 40, iconUrl: 'https://api.iconify.design/game-icons:pie-slice.svg', consumable: { healAmount: 6 }, material: 'cooked-meat' },
    { id: 'half_meat_pie', name: 'Half Meat Pie', description: 'Half of a meat pie.', stackable: false, value: 20, iconUrl: 'https://api.iconify.design/game-icons:pie-slice.svg', consumable: { healAmount: 6 }, material: 'cooked-meat' },
    { id: 'fish_pie', name: 'Fish Pie', description: 'A savory fish pie.', stackable: false, value: 100, iconUrl: 'https://api.iconify.design/game-icons:pie-slice.svg', consumable: { healAmount: 8 }, material: 'uncut-sapphire' },
    { id: 'half_fish_pie', name: 'Half Fish Pie', description: 'Half of a fish pie.', stackable: false, value: 50, iconUrl: 'https://api.iconify.design/game-icons:pie-slice.svg', consumable: { healAmount: 8 }, material: 'uncut-sapphire' },

    // PIZZAS
    { id: 'plain_pizza', name: 'Plain Pizza', description: 'A cheese and tomato pizza.', stackable: false, value: 40, iconUrl: 'https://api.iconify.design/game-icons:full-pizza.svg', consumable: { healAmount: 5 }, material: 'cooked-fish' },
    { id: 'half_plain_pizza', name: '1/2 Plain Pizza', description: 'Half a plain pizza.', stackable: false, value: 20, iconUrl: 'https://api.iconify.design/game-icons:pizza-slice.svg', consumable: { healAmount: 5 }, material: 'cooked-fish' },
    { id: 'meat_pizza', name: 'Meat Pizza', description: 'A pizza with meat chunks.', stackable: false, value: 60, iconUrl: 'https://api.iconify.design/game-icons:full-pizza.svg', consumable: { healAmount: 7 }, material: 'bronze' },
    { id: 'half_meat_pizza', name: '1/2 Meat Pizza', description: 'Half a meat pizza.', stackable: false, value: 30, iconUrl: 'https://api.iconify.design/game-icons:pizza-slice.svg', consumable: { healAmount: 7 }, material: 'bronze' },
    { id: 'anchovy_pizza', name: 'Anchovy Pizza', description: 'A pizza with salty anchovies.', stackable: false, value: 70, iconUrl: 'https://api.iconify.design/game-icons:full-pizza.svg', consumable: { healAmount: 8 }, material: 'uncut-sapphire' },
    { id: 'half_anchovy_pizza', name: '1/2 Anchovy Pizza', description: 'Half an anchovy pizza.', stackable: false, value: 35, iconUrl: 'https://api.iconify.design/game-icons:pizza-slice.svg', consumable: { healAmount: 8 }, material: 'uncut-sapphire' },
    { id: 'pineapple_pizza', name: 'Pineapple Pizza', description: 'A pizza with pineapple chunks.', stackable: false, value: 90, iconUrl: 'https://api.iconify.design/game-icons:full-pizza.svg', consumable: { healAmount: 9 }, material: 'gold' },
    { id: 'half_pineapple_pizza', name: '1/2 Pineapple Pizza', description: 'Half a pineapple pizza.', stackable: false, value: 45, iconUrl: 'https://api.iconify.design/game-icons:pizza-slice.svg', consumable: { healAmount: 9 }, material: 'gold' },


    // Burnt Food
    { id: 'burnt_food', name: 'Burnt Food', description: 'This is probably not edible.', stackable: false, value: 0, iconUrl: 'https://api.iconify.design/game-icons:fire-bowl.svg', material: 'burnt' },
    { id: 'burnt_cake', name: 'Burnt Cake', description: 'A black, crispy cake stuck in the tin.', stackable: false, value: 0, iconUrl: 'https://api.iconify.design/game-icons:cake-slice.svg', material: 'burnt', emptyable: { emptyItemId: 'cake_tin' } },
    { id: 'burnt_pie', name: 'Burnt Pie', description: 'A burnt pie stuck in the dish.', stackable: false, value: 0, iconUrl: 'https://api.iconify.design/game-icons:pie-slice.svg', material: 'burnt', emptyable: { emptyItemId: 'pie_dish' } },
    { id: 'burnt_pizza', name: 'Burnt Pizza', description: 'A burnt pizza.', stackable: false, value: 0, iconUrl: 'https://api.iconify.design/game-icons:pizza-slice.svg', material: 'burnt' },
    { id: 'burnt_lobster', name: 'Burnt Lobster', description: 'A sad, burnt shell.', stackable: false, value: 0, iconUrl: 'https://api.iconify.design/game-icons:gecko.svg', material: 'burnt' },
    { id: 'burnt_swordfish', name: 'Burnt Swordfish', description: 'You seem to have overcooked this.', stackable: false, value: 0, iconUrl: 'https://api.iconify.design/game-icons:dolphin.svg', material: 'burnt' },
    { id: 'burnt_shark', name: 'Burnt Shark', description: 'You seem to have overcooked this.', stackable: false, value: 0, iconUrl: 'https://api.iconify.design/game-icons:shark-jaws.svg', material: 'burnt' },
    
    // Doughs & Batters & Uncooked
    { id: 'bread_dough', name: 'Bread Dough', description: 'A simple dough, ready to be baked into bread.', stackable: false, value: 4, iconUrl: 'https://api.iconify.design/game-icons:flour.svg' },
    { id: 'pie_dough', name: 'Pie Dough', description: 'A simple dough, ready to be baked into a pie.', stackable: false, value: 4, iconUrl: 'https://api.iconify.design/game-icons:flour.svg' },
    
    { id: 'uncooked_cake', name: 'Uncooked Cake', description: 'Raw cake batter in a tin.', stackable: false, value: 15, iconUrl: 'https://api.iconify.design/game-icons:cake-slice.svg', material: 'raw-fish' },
    { id: 'pie_shell', name: 'Pie Shell', description: 'An empty pie shell.', stackable: false, value: 10, iconUrl: 'https://api.iconify.design/game-icons:pie-slice.svg', material: 'raw-fish' },
    { id: 'uncooked_berry_pie', name: 'Uncooked Berry Pie', description: 'A raw berry pie.', stackable: false, value: 15, iconUrl: 'https://api.iconify.design/game-icons:pie-slice.svg', material: 'raw-meat' },
    { id: 'uncooked_apple_pie', name: 'Uncooked Apple Pie', description: 'A raw apple pie.', stackable: false, value: 20, iconUrl: 'https://api.iconify.design/game-icons:pie-slice.svg', material: 'emerald' },
    { id: 'uncooked_meat_pie', name: 'Uncooked Meat Pie', description: 'A raw meat pie.', stackable: false, value: 25, iconUrl: 'https://api.iconify.design/game-icons:pie-slice.svg', material: 'copper' },
    { id: 'uncooked_fish_pie', name: 'Uncooked Fish Pie', description: 'A raw fish pie.', stackable: false, value: 60, iconUrl: 'https://api.iconify.design/game-icons:pie-slice.svg', material: 'sapphire' },
    { id: 'pizza_base', name: 'Pizza Base', description: 'A plain pizza base.', stackable: false, value: 10, iconUrl: 'https://api.iconify.design/game-icons:full-pizza.svg', material: 'raw-fish' },
    { id: 'incomplete_pizza', name: 'Incomplete Pizza', description: 'A pizza base with tomato sauce.', stackable: false, value: 15, iconUrl: 'https://api.iconify.design/game-icons:full-pizza.svg', material: 'raw-meat' },
    { id: 'uncooked_pizza', name: 'Uncooked Pizza', description: 'A pizza with tomato and cheese, ready to cook or add toppings.', stackable: false, value: 20, iconUrl: 'https://api.iconify.design/game-icons:full-pizza.svg', material: 'copper' },
   
    // Potions & Drinks
    { id: 'beer', name: 'Beer', description: 'A frothy mug of ale. Heals a little, and temporarily boosts your Strength while lowering your Attack.', stackable: false, value: 2, iconUrl: 'https://api.iconify.design/game-icons:beer-stein.svg', consumable: { healAmount: 1, statModifiers: [{ skill: SkillName.Strength, percent: 0.01, base: 2 }, { skill: SkillName.Attack, percent: -0.03, base: 0 }] }, emptyable: { emptyItemId: 'beer_glass' }, material: 'copper' },
    { id: 'bandit_brew', name: 'Bandit\'s Brew', description: 'A rough, potent brew. Temporarily boosts Strength but lowers Defence.', stackable: false, value: 20, iconUrl: 'https://api.iconify.design/game-icons:potion-ball.svg', consumable: { healAmount: 2, statModifiers: [ { skill: SkillName.Strength, percent: 0.033, base: 4 }, { skill: SkillName.Defence, percent: 0.02, base: -2 } ] }, material: 'ruby' },
    { id: 'vial', name: 'Vial', description: 'An empty glass vial.', stackable: false, value: 2, iconUrl: 'https://api.iconify.design/game-icons:round-potion.svg', material: 'vial' },
    { id: 'vial_of_water', name: 'Vial of Water', description: 'A vial filled with water.', stackable: false, value: 2, iconUrl: 'https://api.iconify.design/game-icons:round-potion.svg', emptyable: { emptyItemId: 'vial' }, material: 'vial-water' },
    { id: 'blight_ward_potion', name: 'Blight Ward Potion', description: 'A shimmering potion created by Anise to reveal magical blights.', stackable: false, value: 0, iconUrl: 'https://api.iconify.design/game-icons:potion-ball.svg', material: 'potion-prayer' },
];
