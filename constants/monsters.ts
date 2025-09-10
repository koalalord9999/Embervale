// Obsolete individual files have been removed.

import { Monster } from '../types';
import { beasts } from './beasts';
import { humanoids } from './monsters/humanoids';
import { magicalAndUndead } from './magicalAndUndead';

// Assemble all monsters into a single array
const allMonstersUnsorted: Monster[] = [
    ...beasts,
    ...humanoids,
    ...magicalAndUndead,
];

// Sort the array alphabetically by monster name
allMonstersUnsorted.sort((a, b) => a.name.localeCompare(b.name));

// Create the final MONSTERS record, keyed by monster ID
export const MONSTERS: Record<string, Monster> = allMonstersUnsorted.reduce((acc, monster) => {
    if (acc[monster.id]) {
        console.warn(`Duplicate monster ID found: ${monster.id}. Overwriting.`);
    }
    acc[monster.id] = monster;
    return acc;
}, {} as Record<string, Monster>);