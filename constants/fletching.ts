

interface CarvingRecipe {
    itemId: string;
    level: number;
    xp: number;
    quantity?: number;
}

interface StringingRecipe {
    unstrungId: string;
    strungId: string;
    level: number;
    xp: number;
}

interface TippingRecipe {
    tipId: string;
    arrowId: string;
    level: number;
    xpPer: number;
}

interface HeadlessRecipe {
    level: number;
    xpPer: number;
}

interface FletchingRecipeData {
    carving: Record<string, CarvingRecipe[]>;
    stringing: StringingRecipe[];
    headless: HeadlessRecipe;
    tipping: TippingRecipe[];
}

export const FLETCHING_RECIPES: FletchingRecipeData = {
    carving: {
        'logs': [
            { itemId: 'arrow_shaft', level: 1, xp: 5, quantity: 15 },
            { itemId: 'shortbow_u', level: 1, xp: 5 },
            { itemId: 'longbow_u', level: 5, xp: 10 },
        ],
        'oak_logs': [
            { itemId: 'oak_shortbow_u', level: 20, xp: 16.5 },
            { itemId: 'oak_longbow_u', level: 25, xp: 25 },
        ],
        'willow_logs': [
            { itemId: 'willow_shortbow_u', level: 35, xp: 33.3 },
            { itemId: 'willow_longbow_u', level: 40, xp: 41.5 },
        ],
        'feywood_logs': [
            { itemId: 'feywood_shortbow_u', level: 50, xp: 50 },
            { itemId: 'feywood_longbow_u', level: 55, xp: 58.3 },
        ],
        'yew_logs': [
            { itemId: 'yew_shortbow_u', level: 65, xp: 67.5 },
            { itemId: 'yew_longbow_u', level: 70, xp: 75 },
        ]
    },
    stringing: [
        { unstrungId: 'shortbow_u', strungId: 'shortbow', level: 5, xp: 5 },
        { unstrungId: 'longbow_u', strungId: 'longbow', level: 10, xp: 10 },
        { unstrungId: 'oak_shortbow_u', strungId: 'oak_shortbow', level: 25, xp: 16.5 },
        { unstrungId: 'oak_longbow_u', strungId: 'oak_longbow', level: 30, xp: 25 },
        { unstrungId: 'willow_shortbow_u', strungId: 'willow_shortbow', level: 40, xp: 33.3 },
        { unstrungId: 'willow_longbow_u', strungId: 'willow_longbow', level: 45, xp: 41.5 },
        { unstrungId: 'feywood_shortbow_u', strungId: 'feywood_shortbow', level: 55, xp: 50 },
        { unstrungId: 'feywood_longbow_u', strungId: 'feywood_longbow', level: 60, xp: 58.3 },
        { unstrungId: 'yew_shortbow_u', strungId: 'yew_shortbow', level: 70, xp: 67.5 },
        { unstrungId: 'yew_longbow_u', strungId: 'yew_longbow', level: 75, xp: 75 },
    ],
    headless: {
        level: 1,
        xpPer: 1,
    },
    tipping: [
        { tipId: 'bronze_arrowtips', arrowId: 'bronze_arrow', level: 1, xpPer: 1.3 },
        { tipId: 'iron_arrowtips', arrowId: 'iron_arrow', level: 15, xpPer: 2.5 },
        { tipId: 'steel_arrowtips', arrowId: 'steel_arrow', level: 30, xpPer: 5 },
        { tipId: 'mithril_arrowtips', arrowId: 'mithril_arrow', level: 45, xpPer: 7.5 },
        { tipId: 'adamantite_arrowtips', arrowId: 'adamantite_arrow', level: 60, xpPer: 10 },
        { tipId: 'runic_arrowtips', arrowId: 'runic_arrow', level: 75, xpPer: 12.5 },
    ]
};