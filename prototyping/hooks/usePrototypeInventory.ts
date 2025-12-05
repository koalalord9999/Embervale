import { useInventory as useMainInventory } from '../../hooks/useInventory';
import { InventorySlot, Equipment } from '../../types';

interface PrototypeInventoryProps {
    initialInventory: (InventorySlot | null)[];
    initialCoins: number;
    initialEquipment: Equipment;
    addLog: (msg: string) => void;
    onItemDropped: (item: InventorySlot) => void;
}

export const usePrototypeInventory = (props: PrototypeInventoryProps) => {
    const { initialInventory, initialCoins, initialEquipment, addLog, onItemDropped } = props;

    const inventoryManager = useMainInventory(
        {
            inventory: initialInventory,
            coins: initialCoins,
            equipment: initialEquipment,
        },
        addLog,
        {
            onItemDropped: (item) => onItemDropped(item),
        }
    );

    return inventoryManager;
};
