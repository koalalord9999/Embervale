
import React, { useState, useEffect, useMemo } from 'react';

interface HitSplatProps {
    damage: number | 'miss';
    isMaxHit?: boolean;
    isPoison?: boolean;
    isMagic?: boolean;
    isDragonfire?: boolean;
    delay?: number; // Optional delay before showing
}

const HitSplat: React.FC<HitSplatProps> = ({ damage, isMaxHit = false, isPoison = false, isMagic = false, isDragonfire = false, delay = 0 }) => {
    const isMiss = damage === 'miss' || damage === 0;
    const text = isMiss ? '0' : String(damage);

    const splatColorClass = useMemo(() => {
        if (isMaxHit && typeof damage === 'number' && damage >= 2) return 'hitsplat-orange';
        if (isMiss) return 'hitsplat-blue';
        if (isPoison) return 'hitsplat-green';
        if (isDragonfire) return 'hitsplat-dragonfire';
        return 'hitsplat-red';
    }, [isMiss, isMaxHit, isPoison, isDragonfire, damage]);

    const [style, setStyle] = useState<React.CSSProperties>({ 
        top: '50%', 
        left: '50%', 
        opacity: 0, 
        transform: 'translate(-50%, -50%) scale(0.5)' 
    });

    useEffect(() => {
        let showTimer: number;
        let hideTimer: number;

        const startAnimation = () => {
            // Randomize position slightly for visual variety if multiple stack
            const top = `${Math.random() * 60 + 20}%`;
            const left = `${Math.random() * 60 + 20}%`;
            
            setStyle({ top, left, opacity: 1, transform: 'translate(-50%, -50%) scale(1)' });
            
            hideTimer = window.setTimeout(() => {
                setStyle(s => ({ ...s, opacity: 0, transform: 'translate(-50%, -70%) scale(0.8)' }));
            }, 800);
        };

        if (delay > 0) {
            showTimer = window.setTimeout(startAnimation, delay);
        } else {
            startAnimation();
        }

        return () => {
            clearTimeout(showTimer);
            clearTimeout(hideTimer);
        };
    }, [delay]);

    return (
        <div className="hitsplat-container" style={style}>
            <div className={`hitsplat-splat ${splatColorClass}`}></div>
            <span className="hitsplat-text">{text}</span>
        </div>
    );
};

export default HitSplat;
