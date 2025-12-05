import { useRef, useEffect } from 'react';
import { PlayerModel } from '../playerModel';
import { HumanoidModel } from '../humanoidModel';
import { meadowdaleEntities } from '../world/meadowdale';
import { MONSTERS } from '../../constants';

export const usePrototypeModels = () => {
    const playerRef = useRef(new PlayerModel(19, 38));
    const humanoidsRef = useRef<HumanoidModel[]>([]);

    useEffect(() => {
        humanoidsRef.current = meadowdaleEntities
            .filter(e => e.type === 'npc')
            .map(e => {
                const model = new HumanoidModel(e.id, e.x, e.y, e.name, { 
                    shirtColor: e.color, 
                    aiType: e.aiType,
                    leashRange: e.leashRange
                });
                model.spawnX = e.spawnX ?? e.x;
                model.spawnY = e.spawnY ?? e.y;

                if (e.monsterId) {
                    const monsterData = MONSTERS[e.monsterId];
                    if (monsterData) {
                        model.hp = monsterData.maxHp;
                        model.maxHp = monsterData.maxHp;
                    }
                }

                return model;
            });
    }, []);

    return { playerRef, humanoidsRef };
};
