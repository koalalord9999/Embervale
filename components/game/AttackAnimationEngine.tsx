import React, { useState, useEffect, useRef } from 'react';

type AttackType = 'stab' | 'slash' | 'crush' | 'ranged' | 'magic';
type AnimationSource = 'player' | 'monster';

interface Animation {
    id: number;
    type: AttackType;
    source: AnimationSource;
    options: {
        arrowType?: string | null;
        spellTier?: number;
    };
}

interface AnimationProps {
    triggers: Animation[];
    playerRef: React.RefObject<HTMLDivElement>;
    monsterRef: React.RefObject<HTMLDivElement>;
    onAnimationComplete: (id: number) => void;
}

const Projectile: React.FC<{
    id: number,
    type: 'ranged' | 'magic',
    start: { x: number, y: number },
    end: { x: number, y: number },
    options: Animation['options'],
    onComplete: (id: number) => void
}> = ({ id, type, start, end, options, onComplete }) => {
    const [position, setPosition] = useState(start);
    const startTimeRef = useRef(Date.now());
    const duration = 400; // ms

    useEffect(() => {
        let animationFrameId: number;
        const animate = () => {
            const now = Date.now();
            const elapsed = now - startTimeRef.current;
            const progress = Math.min(1, elapsed / duration);

            const newX = start.x + (end.x - start.x) * progress;
            const newY = start.y + (end.y - start.y) * progress;

            setPosition({ x: newX, y: newY });

            if (progress < 1) {
                animationFrameId = requestAnimationFrame(animate);
            } else {
                onComplete(id);
            }
        };
        animationFrameId = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(animationFrameId);
    }, [id, start, end, onComplete]);

    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const angle = Math.atan2(dy, dx) * 180 / Math.PI;

    const renderProjectile = () => {
        if (type === 'ranged') {
            const tipClass = options.arrowType ? `arrow-tip-${options.arrowType}` : 'arrow-tip-default';
            return (
                <div className="anim-ranged" style={{ transform: `rotate(${angle}deg)` }}>
                    <svg viewBox="0 0 100 100">
                        <polygon points="0,45 70,45 70,35 90,50 70,65 70,55 0,55" className="arrow-shaft" />
                        <polygon points="90,50 70,35 80,50 70,65" className={tipClass} />
                    </svg>
                </div>
            );
        }
        if (type === 'magic') {
            const spellTier = options.spellTier ?? 1;
            return <div className={`anim-magic anim-magic-${spellTier}`} style={{ transform: `rotate(${angle}deg)` }} />;
        }
        return null;
    };

    return (
        <div className="attack-animation" style={{ left: position.x, top: position.y }}>
            {renderProjectile()}
        </div>
    );
};

const AttackAnimationEngine: React.FC<AnimationProps> = ({ triggers, playerRef, monsterRef, onAnimationComplete }) => {
    const [animations, setAnimations] = useState<any[]>([]);
    const prevTriggersRef = useRef<Animation[]>([]);

    useEffect(() => {
        const newTriggers = triggers.filter(t => !prevTriggersRef.current.some(pt => pt.id === t.id));

        if (newTriggers.length > 0) {
            const containerRect = playerRef.current?.parentElement?.parentElement?.parentElement?.getBoundingClientRect();
            if (!containerRect) return;

            const newAnimations = newTriggers.map(trigger => {
                const sourceEl = trigger.source === 'player' ? playerRef.current : monsterRef.current;
                const targetEl = trigger.source === 'player' ? monsterRef.current : playerRef.current;
                if (!sourceEl || !targetEl) return null;

                const sourceRect = sourceEl.getBoundingClientRect();
                const targetRect = targetEl.getBoundingClientRect();
        
                const sourceCenter = {
                    x: sourceRect.left - containerRect.left + sourceRect.width / 2,
                    y: sourceRect.top - containerRect.top + sourceRect.height / 2,
                };
                const targetCenter = {
                    x: targetRect.left - containerRect.left + targetRect.width / 2,
                    y: targetRect.top - containerRect.top + targetRect.height / 2,
                };

                return { ...trigger, start: sourceCenter, end: targetCenter };
            }).filter(Boolean);

            setAnimations(prev => [...prev, ...newAnimations]);
        }

        prevTriggersRef.current = triggers;
    }, [triggers, playerRef, monsterRef]);

    const handleAnimationEnd = (id: number) => {
        setAnimations(prev => prev.filter(anim => anim.id !== id));
        onAnimationComplete(id);
    };

    return (
        <div className="animation-container">
            {animations.map(anim => {
                const dx = anim.end.x - anim.start.x;
                const dy = anim.end.y - anim.start.y;
                const angle = Math.atan2(dy, dx) * 180 / Math.PI;
                const distance = Math.sqrt(dx*dx + dy*dy);

                if (anim.type === 'ranged' || anim.type === 'magic') {
                     // Ranged projectiles have random starting points
                    let startPos = { ...anim.start };
                    if (anim.type === 'ranged') {
                        const randomAngle = Math.random() * 2 * Math.PI;
                        const randomRadius = 40;
                        startPos.x += Math.cos(randomAngle) * randomRadius;
                        startPos.y += Math.sin(randomAngle) * randomRadius;
                    }

                    return <Projectile key={anim.id} id={anim.id} type={anim.type} start={startPos} end={anim.end} options={anim.options} onComplete={handleAnimationEnd} />;
                }

                return (
                    <div
                        key={anim.id}
                        className="attack-animation"
                        onAnimationEnd={() => handleAnimationEnd(anim.id)}
                        style={{
                            top: anim.type === 'stab' ? `${anim.start.y}px` : `${anim.end.y - 60}px`,
                            left: anim.type === 'stab' ? `${anim.start.x}px` : `${anim.end.y - 60}px`,
                            transform: anim.type === 'stab' ? `rotate(${angle}deg)` : 'none',
                        }}
                    >
                        {anim.type === 'stab' && <div className="anim-stab" style={{width: `${distance}px`}} />}
                        {anim.type === 'slash' && (
                            <div className="anim-slash">
                                <svg viewBox="0 0 100 100">
                                    <path d="M 10,90 Q 50,90 90,50" stroke="white" strokeWidth="5" fill="none" />
                                    <path d="M 20,80 Q 50,80 80,50" stroke="white" strokeWidth="2" fill="none" />
                                </svg>
                            </div>
                        )}
                         {anim.type === 'crush' && (
                            <div className="anim-crush" style={{top: `${anim.end.y-40}px`, left: `${anim.end.x-40}px`}}>
                               <div className="anim-crush-hammer" />
                               <div className="anim-crush-shockwave" />
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default AttackAnimationEngine;