

import { POI } from '../../types';
import { meadowdalePois } from './meadowdale';
import { minePois } from './mines';
import { southernRoadPois } from './southern_road';
import { wildernessPois } from './wilderness';
import { farmlandsPois } from './farmlands';
import { goblinDungeonPois } from './dungeon_goblin';
import { oakhavenRoadPois } from './oakhaven_road';
import { oakhavenPois } from './oakhaven';
import { galeSweptPeaksPois } from './gale_swept_peaks';
import { sunkenLandsPois } from './sunken_lands';
import { theVerdantFieldsPois } from './the_verdant_fields';
import { theFeywoodPois } from './the_feywood';
import { theSerpentsCoilPois } from './the_serpents_coil';
import { silverhavenPois } from './silverhaven';
import { banditHideoutPois } from './bandit_hideout';
import { isleOfWhispersPois } from './isle_of_whispers';
import { sunkenLabyrinthPois } from './dungeon_sunken_labyrinth';

export const POIS: Record<string, POI> = {
    ...meadowdalePois,
    ...wildernessPois,
    ...minePois,
    ...southernRoadPois,
    ...farmlandsPois,
    ...goblinDungeonPois,
    ...oakhavenRoadPois,
    ...oakhavenPois,
    ...galeSweptPeaksPois,
    ...sunkenLandsPois,
    ...theVerdantFieldsPois,
    ...theFeywoodPois,
    ...theSerpentsCoilPois,
    ...silverhavenPois,
    ...banditHideoutPois,
    ...isleOfWhispersPois,
    ...sunkenLabyrinthPois,
};