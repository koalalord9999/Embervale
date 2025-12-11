
// This barrel file combines all monster data from the /monsters directory.

import { Monster } from '../types';
import { beasts } from './monsters/beasts';
import { humanoids } from './monsters/humanoids';
import { dragons } from './monsters/dragons';
import { undead } from './monsters/undead';
import { elemental } from './monsters/elemental';
import { demon } from './monsters/demon';
import { armored } from './monsters/armored';
import { vampire } from './monsters/vampire';
import { sunbright } from './monsters/sunbright';
import { frostfang } from './monsters/frostfang';
import { wyrmwoodMonsters } from './monsters/wyrmwood';
import { sunscorchedMonsters } from './monsters/sunscorched';
import { slayer } from './monsters/slayer';

// Assemble all monsters into a single array
const allMonstersUnsorted: Monster[] = [
    ...beasts,
    ...humanoids,
    ...dragons,
    ...undead,
    ...elemental,
    ...demon,
    ...armored,
    ...vampire,
    ...sunbright,
    ...frostfang,
    ...wyrmwoodMonsters,
    ...sunscorchedMonsters,
    ...slayer,
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