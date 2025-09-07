
import { Item } from '../../types';

export const cleanCoinPouch: Item = {
    id: 'clean_coin_pouch',
    name: 'Clean Coin Pouch',
    description: 'A clean pouch, ready to be opened.',
    stackable: false,
    value: 0,
    iconUrl: 'https://api.iconify.design/game-icons:money-stack.svg',
    consumable: {
        givesCoins: {
            min: 20,
            max: 150
        }
    }
};
