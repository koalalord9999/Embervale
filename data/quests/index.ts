
import { Quest } from '../../types';
import { aSmithsApprentice } from './a_smiths_apprentice';
import { ancientBlade } from './ancient_blade';
import { banditToll } from './bandit_toll';
import { capitalsCall } from './capitals_call';
import { embrune101 } from './embrune_101';
import { goblinMenace } from './goblin_menace';
import { lostHeirloom } from './lost_heirloom';
import { magicalRunestoneDiscovery } from './magical_runestone_discovery';
import { missingShipment } from './missing_shipment';
import { sheepTroubles } from './sheep_troubles';
import { theArcaneAwakening } from './the_arcane_awakening';
import { petuniaProblems } from './petunia_problems';
import { anEchoOfBattle } from './an_echo_of_battle';
import { depthsOfDespair } from './depths_of_despair';
import { whispersOfTheDivine } from './whispers_of_the_divine';


export const QUESTS: Record<string, Quest> = {
    [aSmithsApprentice.id]: aSmithsApprentice,
    [ancientBlade.id]: ancientBlade,
    [banditToll.id]: banditToll,
    [capitalsCall.id]: capitalsCall,
    [embrune101.id]: embrune101,
    [goblinMenace.id]: goblinMenace,
    [lostHeirloom.id]: lostHeirloom,
    [magicalRunestoneDiscovery.id]: magicalRunestoneDiscovery,
    [missingShipment.id]: missingShipment,
    [sheepTroubles.id]: sheepTroubles,
    [theArcaneAwakening.id]: theArcaneAwakening,
    [petuniaProblems.id]: petuniaProblems,
    [anEchoOfBattle.id]: anEchoOfBattle,
    [depthsOfDespair.id]: depthsOfDespair,
    [whispersOfTheDivine.id]: whispersOfTheDivine,
};
