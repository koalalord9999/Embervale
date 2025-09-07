
import { Item } from '../../types';

export const stolenCaravanGoods: Item = {
    id: 'stolen_caravan_goods',
    name: 'Stolen Caravan Goods',
    description: 'A crate of valuable goods, stolen from a Silverhaven merchant.',
    stackable: false,
    value: 0, // Quest item, no sell value
    iconUrl: 'https://api.iconify.design/game-icons:crate.svg'
};
