import { Item } from '../../../types';
import { harpyFeather } from '../harpy_feather';
import { headlessArrow } from '../headless_arrow';

export const items: Item[] = [
    harpyFeather,
    headlessArrow,
    // HERBS - Grimy
    { id: 'grimy_guromoot', name: 'Grimy Guromoot', description: 'A grimy herb.', stackable: false, value: 1, iconUrl: 'https://api.iconify.design/game-icons:herbs-bundle.svg', material: 'grimy-herb', cleanable: { cleanItemId: 'clean_guromoot', xp: 2.5 } },
    { id: 'grimy_marleaf', name: 'Grimy Marleaf', description: 'A grimy herb.', stackable: false, value: 2, iconUrl: 'https://api.iconify.design/game-icons:herbs-bundle.svg', material: 'grimy-herb', cleanable: { cleanItemId: 'clean_marleaf', xp: 3.8 } },
    { id: 'grimy_swiftthistle', name: 'Grimy Swiftthistle', description: 'A grimy herb.', stackable: false, value: 3, iconUrl: 'https://api.iconify.design/game-icons:herbs-bundle.svg', material: 'grimy-herb', cleanable: { cleanItemId: 'clean_swiftthistle', xp: 5 } },
    { id: 'grimy_redfang_leaf', name: 'Grimy Redfang Leaf', description: 'A grimy herb.', stackable: false, value: 4, iconUrl: 'https://api.iconify.design/game-icons:herbs-bundle.svg', material: 'grimy-herb', cleanable: { cleanItemId: 'clean_redfang_leaf', xp: 6.3 } },
    { id: 'grimy_suns_kiss', name: 'Grimy Sun\'s Kiss', description: 'A grimy herb.', stackable: false, value: 5, iconUrl: 'https://api.iconify.design/game-icons:herbs-bundle.svg', material: 'grimy-herb', cleanable: { cleanItemId: 'clean_suns_kiss', xp: 7.5 } },
    { id: 'grimy_bog_nettle', name: 'Grimy Bog Nettle', description: 'A grimy herb.', stackable: false, value: 6, iconUrl: 'https://api.iconify.design/game-icons:herbs-bundle.svg', material: 'grimy-herb', cleanable: { cleanItemId: 'clean_bog_nettle', xp: 8 } },
    { id: 'grimy_gloom_moss', name: 'Grimy Gloom Moss', description: 'A grimy herb.', stackable: false, value: 7, iconUrl: 'https://api.iconify.design/game-icons:herbs-bundle.svg', material: 'grimy-herb', cleanable: { cleanItemId: 'clean_gloom_moss', xp: 8.8 } },
    { id: 'grimy_windwhisper_bud', name: 'Grimy Windwhisper Bud', description: 'A grimy herb.', stackable: false, value: 8, iconUrl: 'https://api.iconify.design/game-icons:herbs-bundle.svg', material: 'grimy-herb', cleanable: { cleanItemId: 'clean_windwhisper_bud', xp: 10 } },
    { id: 'grimy_cinderbloom', name: 'Grimy Cinderbloom', description: 'A grimy herb.', stackable: false, value: 9, iconUrl: 'https://api.iconify.design/game-icons:herbs-bundle.svg', material: 'grimy-herb', cleanable: { cleanItemId: 'clean_cinderbloom', xp: 11.3 } },
    { id: 'grimy_wyrmfire_petal', name: 'Grimy Wyrmfire Petal', description: 'A grimy herb.', stackable: false, value: 10, iconUrl: 'https://api.iconify.design/game-icons:herbs-bundle.svg', material: 'grimy-herb', cleanable: { cleanItemId: 'clean_wyrmfire_petal', xp: 11.8 } },
    { id: 'grimy_duskshade', name: 'Grimy Duskshade', description: 'A grimy herb.', stackable: false, value: 11, iconUrl: 'https://api.iconify.design/game-icons:herbs-bundle.svg', material: 'grimy-herb', cleanable: { cleanItemId: 'clean_duskshade', xp: 12.5 } },
    { id: 'grimy_stonebloom', name: 'Grimy Stonebloom', description: 'A grimy herb.', stackable: false, value: 12, iconUrl: 'https://api.iconify.design/game-icons:herbs-bundle.svg', material: 'grimy-herb', cleanable: { cleanItemId: 'clean_stonebloom', xp: 13.8 } },
    // HERBS - Clean
    { id: 'clean_guromoot', name: 'Guromoot', description: 'A clean herb.', stackable: false, value: 2, iconUrl: 'https://api.iconify.design/game-icons:herbs-bundle.svg', material: 'clean-herb' },
    { id: 'clean_marleaf', name: 'Marleaf', description: 'A clean herb.', stackable: false, value: 3, iconUrl: 'https://api.iconify.design/game-icons:herbs-bundle.svg', material: 'clean-herb' },
    { id: 'clean_swiftthistle', name: 'Swiftthistle', description: 'A clean herb.', stackable: false, value: 4, iconUrl: 'https://api.iconify.design/game-icons:herbs-bundle.svg', material: 'clean-herb' },
    { id: 'clean_redfang_leaf', name: 'Redfang Leaf', description: 'A clean herb.', stackable: false, value: 5, iconUrl: 'https://api.iconify.design/game-icons:herbs-bundle.svg', material: 'clean-herb' },
    { id: 'clean_suns_kiss', name: 'Sun\'s Kiss', description: 'A clean herb.', stackable: false, value: 6, iconUrl: 'https://api.iconify.design/game-icons:herbs-bundle.svg', material: 'clean-herb' },
    { id: 'clean_bog_nettle', name: 'Bog Nettle', description: 'A clean herb.', stackable: false, value: 7, iconUrl: 'https://api.iconify.design/game-icons:herbs-bundle.svg', material: 'clean-herb' },
    { id: 'clean_gloom_moss', name: 'Gloom Moss', description: 'A clean herb.', stackable: false, value: 8, iconUrl: 'https://api.iconify.design/game-icons:herbs-bundle.svg', material: 'clean-herb' },
    { id: 'clean_windwhisper_bud', name: 'Windwhisper Bud', description: 'A clean herb.', stackable: false, value: 9, iconUrl: 'https://api.iconify.design/game-icons:herbs-bundle.svg', material: 'clean-herb' },
    { id: 'clean_cinderbloom', name: 'Cinderbloom', description: 'A clean herb.', stackable: false, value: 10, iconUrl: 'https://api.iconify.design/game-icons:herbs-bundle.svg', material: 'clean-herb' },
    { id: 'clean_wyrmfire_petal', name: 'Wyrmfire Petal', description: 'A clean herb.', stackable: false, value: 11, iconUrl: 'https://api.iconify.design/game-icons:herbs-bundle.svg', material: 'clean-herb' },
    { id: 'clean_duskshade', name: 'Duskshade', description: 'A clean herb.', stackable: false, value: 12, iconUrl: 'https://api.iconify.design/game-icons:herbs-bundle.svg', material: 'clean-herb' },
    { id: 'clean_stonebloom', name: 'Stonebloom', description: 'A clean herb.', stackable: false, value: 13, iconUrl: 'https://api.iconify.design/game-icons:herbs-bundle.svg', material: 'clean-herb' },
];