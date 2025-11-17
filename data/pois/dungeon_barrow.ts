
import { POI, SkillName } from '../../types';

export const barrowOfTheRevenantPois: Record<string, POI> = {
    barrow_entrance_hall: {
        id: 'barrow_entrance_hall',
        name: 'Barrow Entrance Hall',
        description: 'A cold draft blows from the darkness ahead. The air is heavy with the smell of dust and ancient death. The stone door grinds shut behind you.',
        connections: ['forgotten_barrow', 'barrow_crypt'],
        activities: [
            { type: 'combat', monsterId: 'skeletal_archer' }
        ],
        regionId: 'barrow_of_the_revenant',
        x: 400, y: 970,
        type: 'internal',
    },
    barrow_crypt: {
        id: 'barrow_crypt',
        name: 'The Crypt',
        description: 'Stone sarcophagi line the walls, some broken open. The rattling of bones echoes in the silence.',
        connections: ['barrow_entrance_hall', 'barrow_antechamber'],
        activities: [
            { type: 'combat', monsterId: 'sunken_zombie' },
            { type: 'combat', monsterId: 'skeletal_archer' }
        ],
        regionId: 'barrow_of_the_revenant',
        x: 400, y: 990,
        type: 'internal',
    },
    barrow_antechamber: {
        id: 'barrow_antechamber',
        name: 'Antechamber',
        description: 'A circular room before a grand, sealed door. The air here is colder still, and a palpable sense of dread emanates from beyond the door.',
        connections: ['barrow_crypt', 'barrow_throne_room'],
        activities: [
            { type: 'combat', monsterId: 'grave_revenant' }
        ],
        regionId: 'barrow_of_the_revenant',
        x: 400, y: 1010,
        type: 'internal',
    },
    barrow_throne_room: {
        id: 'barrow_throne_room',
        name: 'Throne of the Revenant Lord',
        description: 'A large, vaulted chamber. At its center, a throne of polished bone sits empty. A hulking figure in ancient plate armor rises as you enter, its eyes burning with a cold, blue light.',
        connections: ['barrow_antechamber'],
        activities: [
            { type: 'combat', monsterId: 'grave_revenant_lord' }
        ],
        regionId: 'barrow_of_the_revenant',
        x: 400, y: 1030,
        type: 'internal',
    }
};
