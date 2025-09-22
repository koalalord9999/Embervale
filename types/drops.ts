export interface BaseDrop {
    itemId?: string;
    tableId?: string;
    minQuantity: number;
    maxQuantity: number;
}
export interface GuaranteedDrop extends BaseDrop {}
export interface WeightedDrop extends BaseDrop {
    chance: number; // Weight
}
export interface TertiaryDrop extends BaseDrop {
    chance: number; // Probability
}
