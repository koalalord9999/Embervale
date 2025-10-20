import { POI } from '../../types';

export const pilferingPois: Record<string, POI> = {
    pilfering_house_instance: {
        id: 'pilfering_house_instance',
        name: 'House Interior',
        description: "You've successfully picked the lock and slipped inside. You can hear the faint sounds of the street outside, but for now, you are alone. You'd better be quick before the owners return.",
        connections: [], // Connections are handled dynamically
        activities: [
            {
                type: 'npc',
                name: 'Leave House',
                icon: 'https://api.iconify.design/game-icons:exit-door.svg',
            }
        ],
        regionId: 'wilderness', // Generic region, won't be shown on map
        x: -1000, y: -1000, // Off-map coordinates
        type: 'internal',
    },
};
