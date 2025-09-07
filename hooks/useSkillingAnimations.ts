
import { useState, useEffect, useRef } from 'react';
import { ResourceNodeState, SkillName, POI } from '../types';

type SkillingActivity = Extract<POI['activities'][number], { type: 'skilling' }>;

export const useSkillingAnimations = (resourceNodeStates: Record<string, ResourceNodeState>, activities: POI['activities']) => {
    const [depletedNodesAnimating, setDepletedNodesAnimating] = useState<Record<string, SkillName>>({});
    // FIX: Initialize useRef with an explicit undefined value to satisfy linter rule.
    const prevResourceNodeStates = useRef<Record<string, ResourceNodeState> | undefined>(undefined);

    useEffect(() => {
        if (prevResourceNodeStates.current) {
            for (const nodeId in resourceNodeStates) {
                const oldState = prevResourceNodeStates.current[nodeId];
                const newState = resourceNodeStates[nodeId];

                if (oldState && oldState.resources > 0 && newState.resources <= 0) {
                    const activity = activities.find(a => a.type === 'skilling' && a.id === nodeId) as SkillingActivity;
                    if (activity) {
                        setDepletedNodesAnimating(prev => ({ ...prev, [nodeId]: activity.skill }));

                        setTimeout(() => {
                            setDepletedNodesAnimating(prev => {
                                const next = { ...prev };
                                delete next[nodeId];
                                return next;
                            });
                        }, 2000); // Animation duration
                    }
                }
            }
        }
        prevResourceNodeStates.current = resourceNodeStates;
    }, [resourceNodeStates, activities]);

    return { depletedNodesAnimating };
};
