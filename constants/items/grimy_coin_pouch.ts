
import { Item } from '../../types';

export const grimyCoinPouch: Item = {
    id: 'grimy_coin_pouch',
    name: 'Grimy Coin Pouch',
    description: "A small, dirty pouch that jingles slightly. It's too grimy to open by hand.",
    stackable: false,
    value: 50, // A base value for selling, though opening it is better.
    iconUrl: 'https://api.iconify.design/game-icons:money-stack.svg',
    consumable: {
        givesCoins: {
            min: 20,
            max: 150
        }
    }
};
