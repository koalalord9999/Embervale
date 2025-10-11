export interface BaseDrop {
    itemId?: string;
    tableId?: string;
    minQuantity: number;
    maxQuantity: number;
    // Fix: Add optional 'noted' property to support noted item drops.
    noted?: boolean;
}
export interface GuaranteedDrop extends BaseDrop {}
export interface WeightedDrop extends BaseDrop {
    chance: number | string; // Probability (decimal or fraction string)
}
export interface TertiaryDrop extends BaseDrop {
    chance: number; // Probability
}
