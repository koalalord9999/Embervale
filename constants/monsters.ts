

import { Monster } from '../types';
import { allMonstersUnsorted } from './monsters/collections';

// Assemble all monsters into a single array
const allMonsters: Monster[] = [...allMonstersUnsorted];

// Sort the array alphabetically by monster name
allMonsters.sort((a, b) => a.name.localeCompare(b.name));

// Create the final MONSTERS record, keyed by monster ID
export const MONSTERS: Record<string, Monster> = allMonsters.reduce((acc, monster) => {
    acc[monster.id] = monster;
    return acc;
}, {} as Record<string, Monster>);
