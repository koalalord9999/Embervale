import { POI } from '../../types';

export const agilityCoursePois: Record<string, POI> = {
    meadowdale_rooftop_access: {
        id: 'meadowdale_rooftop_access',
        name: 'Rooftop Access',
        description: 'A series of crates and barrels are stacked against a wall here, providing a clear path to the rooftops for the agile.',
        connections: ['east_meadow_street'],
        activities: [
            { type: 'start_agility_course', name: 'Start Rooftop Course (Lvl 1)', courseId: 'meadowdale_rooftops' },
        ],
        regionId: 'meadowdale',
        x: 370, y: 230,
        type: 'internal',
    }
};
