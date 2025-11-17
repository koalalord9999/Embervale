

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

interface HeadlessRecipe {
    level: number;
    xpPer: number;
}

interface TippingRecipe {
    tipId: string;
    arrowId: string;
    level: number;
    xpPer: number;
}

interface StockRecipe {
    logId: string;
    stockId: string;
    level: number;
    xp: number;
}

interface AssemblyRecipe {
    limbsId: string;
    stockId: string;
    unstrungId: string;
    level: number;
    xp: number;
}

interface FeatheringRecipe {
    unfBoltsId: string;
    boltsId: string;
    level: number;
    xpPer: number; // For a batch of 10
}


interface FletchingRecipeData {
    carving: Record<string, CarvingRecipe[]>;
    stocks: StockRecipe[];
    assembly: AssemblyRecipe[];
    stringing: StringingRecipe[];
    headless: HeadlessRecipe;
    tipping: TippingRecipe[];
    feathering: FeatheringRecipe[];
}


export const FLETCHING_RECIPES: FletchingRecipeData = {
    carving: {
        'logs': [
            { itemId: 'arrow_shaft', level: 1, xp: 5, quantity: 15 },
            { itemId: 'shortbow_u', level: 1, xp: 5 },
            { itemId: 'longbow_u', level: 5, xp: 10 },
        ],
        'oak_logs': [
            { itemId: 'arrow_shaft', level: 15, xp: 10, quantity: 30 },
            { itemId: 'oak_shortbow_u', level: 20, xp: 16.5 },
            { itemId: 'oak_longbow_u', level: 25, xp: 25 },
        ],
        'willow_logs': [
            { itemId: 'arrow_shaft', level: 30, xp: 15, quantity: 45 },
            { itemId: 'willow_shortbow_u', level: 35, xp: 33.3 },
            { itemId: 'willow_longbow_u', level: 40, xp: 41.5 },
        ],
        'feywood_logs': [
            { itemId: 'arrow_shaft', level: 45, xp: 20, quantity: 60 },
            { itemId: 'feywood_shortbow_u', level: 50, xp: 50 },
            { itemId: 'feywood_longbow_u', level: 55, xp: 58.3 },
        ],
        'mahogany_logs': [
             { itemId: 'arrow_shaft', level: 60, xp: 25, quantity: 75 },
        ],
        'yew_logs': [
            { itemId: 'arrow_shaft', level: 60, xp: 25, quantity: 75 },
            { itemId: 'yew_shortbow_u', level: 65, xp: 67.5 },
            { itemId: 'yew_longbow_u', level: 70, xp: 75 },
        ]
    },
    stocks: [
        { logId: 'logs', stockId: 'wood_stock', level: 9, xp: 18 },
        { logId: 'oak_logs', stockId: 'oak_stock', level: 24, xp: 36 },
        { logId: 'willow_logs', stockId: 'willow_stock', level: 39, xp: 44 },
        { logId: 'feywood_logs', stockId: 'feywood_stock', level: 54, xp: 60 },
        { logId: 'mahogany_logs', stockId: 'mahogany_stock', level: 69, xp: 85 },
        { logId: 'yew_logs', stockId: 'yew_stock', level: 84, xp: 110 },
    ],
    assembly: [
        { limbsId: 'bronze_limbs', stockId: 'wood_stock', unstrungId: 'bronze_crossbow_unstrung', level: 9, xp: 20 },
        { limbsId: 'iron_limbs', stockId: 'oak_stock', unstrungId: 'iron_crossbow_unstrung', level: 24, xp: 40 },
        { limbsId: 'steel_limbs', stockId: 'willow_stock', unstrungId: 'steel_crossbow_unstrung', level: 39, xp: 50 },
        { limbsId: 'mithril_limbs', stockId: 'feywood_stock', unstrungId: 'mithril_crossbow_unstrung', level: 54, xp: 70 },
        { limbsId: 'adamantite_limbs', stockId: 'mahogany_stock', unstrungId: 'adamantite_crossbow_unstrung', level: 69, xp: 95 },
        { limbsId: 'runic_limbs', stockId: 'yew_stock', unstrungId: 'runic_crossbow_unstrung', level: 84, xp: 120 },
    ],
    stringing: [
        { unstrungId: 'shortbow_u', strungId: 'shortbow', level: 1, xp: 5 },
        { unstrungId: 'longbow_u', strungId: 'longbow', level: 5, xp: 10 },
        { unstrungId: 'oak_shortbow_u', strungId: 'oak_shortbow', level: 20, xp: 16.5 },
        { unstrungId: 'oak_longbow_u', strungId: 'oak_longbow', level: 25, xp: 25 },
        { unstrungId: 'willow_shortbow_u', strungId: 'willow_shortbow', level: 35, xp: 33.3 },
        { unstrungId: 'willow_longbow_u', strungId: 'willow_longbow', level: 40, xp: 41.5 },
        { unstrungId: 'feywood_shortbow_u', strungId: 'feywood_shortbow', level: 50, xp: 50 },
        { unstrungId: 'feywood_longbow_u', strungId: 'feywood_longbow', level: 55, xp: 58.3 },
        { unstrungId: 'yew_shortbow_u', strungId: 'yew_shortbow', level: 65, xp: 67.5 },
        { unstrungId: 'yew_longbow_u', strungId: 'yew_longbow', level: 70, xp: 75 },
        { unstrungId: 'bronze_crossbow_unstrung', strungId: 'bronze_crossbow', level: 9, xp: 10 },
        { unstrungId: 'iron_crossbow_unstrung', strungId: 'iron_crossbow', level: 24, xp: 25 },
        { unstrungId: 'steel_crossbow_unstrung', strungId: 'steel_crossbow', level: 39, xp: 42 },
        { unstrungId: 'mithril_crossbow_unstrung', strungId: 'mithril_crossbow', level: 54, xp: 58 },
        { unstrungId: 'adamantite_crossbow_unstrung', strungId: 'adamantite_crossbow', level: 69, xp: 70 },
        { unstrungId: 'runic_crossbow_unstrung', strungId: 'runic_crossbow', level: 84, xp: 80 },
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
    ],
    feathering: [
        { unfBoltsId: 'bronze_bolts_unf', boltsId: 'bronze_bolts', level: 1, xpPer: 1.5 },
        { unfBoltsId: 'iron_bolts_unf', boltsId: 'iron_bolts', level: 15, xpPer: 3 },
        { unfBoltsId: 'steel_bolts_unf', boltsId: 'steel_bolts', level: 30, xpPer: 4.5 },
        { unfBoltsId: 'mithril_bolts_unf', boltsId: 'mithril_bolts', level: 50, xpPer: 6 },
        { unfBoltsId: 'adamantite_bolts_unf', boltsId: 'adamantite_bolts', level: 65, xpPer: 8 },
        { unfBoltsId: 'runic_bolts_unf', boltsId: 'runic_bolts', level: 80, xpPer: 10 },
    ]
};