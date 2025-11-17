

import React, { useEffect } from 'react';
import { SkillName } from '../../types';
import { SKILL_ICONS, getSkillColorClass } from '../../constants';

export interface XpDrop {
  id: number;
  skillName: SkillName;
  amount: number;
}

interface XpTrackerProps {
  drops: XpDrop[];
  onRemoveDrop: (id: number) => void;
}

const XpDropDisplay: React.FC<{ drop: XpDrop; onRemove: (id: number) => void }> = ({ drop, onRemove }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onRemove(drop.id);
    }, 1450); // Just before animation ends
    return () => clearTimeout(timer);
  }, [drop.id, onRemove]);

  return (
    <div className="animate-xp-drop flex items-center gap-2 p-1 bg-black/70 rounded-lg shadow-lg" style={{textShadow: '1px 1px 2px black'}}>
      <div
          className={`w-5 h-5 ${getSkillColorClass(drop.skillName)}`}
          style={{
              maskImage: `url(${SKILL_ICONS[drop.skillName]})`,
              maskSize: 'contain',
              maskRepeat: 'no-repeat',
              maskPosition: 'center',
              WebkitMaskImage: `url(${SKILL_ICONS[drop.skillName]})`,
              WebkitMaskSize: 'contain',
              WebkitMaskRepeat: 'no-repeat',
              WebkitMaskPosition: 'center',
          }}
      />
      <span className="font-bold text-yellow-300 text-sm">+{drop.amount.toLocaleString()}</span>
    </div>
  );
};

const XpTracker: React.FC<XpTrackerProps> = ({ drops, onRemoveDrop }) => {
  return (
    <div className="absolute top-24 right-[calc(25%-1rem)] w-0 pointer-events-none z-50 flex flex-col items-center gap-1">
      {drops.map(drop => (
        <XpDropDisplay key={drop.id} drop={drop} onRemove={onRemoveDrop} />
      ))}
    </div>
  );
};

export default XpTracker;