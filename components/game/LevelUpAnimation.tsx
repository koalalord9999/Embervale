import React, { useMemo } from 'react';
import { SkillName } from '../../types';
import { SKILL_ICONS } from '../../constants';

interface LevelUpAnimationProps {
    skill: SkillName;
    level: number;
}

const FIREWORK_COLORS = ['#FFD700', '#FF4500', '#FF69B4', '#ADFF2F', '#1E90FF', '#9400D3', '#00FFFF'];

const LevelUpAnimation: React.FC<LevelUpAnimationProps> = ({ skill, level }) => {
    const isMaxLevel = level === 99;
    const numFireworks = isMaxLevel ? 36 : 10;
    const animationDuration = isMaxLevel ? '8s' : '4s';

    const fireworks = useMemo(() => {
        return Array.from({ length: numFireworks }).map((_, i) => {
            const color = FIREWORK_COLORS[Math.floor(Math.random() * FIREWORK_COLORS.length)];
            const size = Math.random() * 16 + 3; // size in px
            const duration = Math.random() * 1.5 + (isMaxLevel ? 6.0 : 3.0); // duration in s
            const delay = Math.random() * (isMaxLevel ? 6 : 2.5); // delay in s
            const top = `${Math.random() * 70 + 10}%`; // vertical explosion point
            const left = `${Math.random() * 80 + 10}%`; // horizontal explosion point
            const numParticles = isMaxLevel ? 80 : 40;

            return {
                id: i,
                style: { top, left },
                particles: Array.from({ length: numParticles }).map((__, p_idx) => {
                    const angle = (p_idx / numParticles) * 360;
                    const particle_duration = duration * (Math.random() * 0.3 + 0.7);
                    const distance = (Math.random() * 40 + 40) * (isMaxLevel ? 1.5 : 1);
                    return {
                        id: p_idx,
                        style: {
                            backgroundColor: color,
                            width: `${size}px`,
                            height: `${size}px`,
                            '--angle': `${angle}deg`,
                            '--distance': `${distance}px`,
                            animationDuration: `${particle_duration}s, ${particle_duration}s`,
                            animationDelay: `${delay}s, ${delay}s`,
                        } as React.CSSProperties,
                    };
                }),
            };
        });
    }, [isMaxLevel, numFireworks]);

    return (
        <div className="level-up-container" style={{ animationDuration }}>
            <div className={`level-up-centerpiece ${isMaxLevel ? 'max-level' : ''}`}>
                <div className="level-up-omega">Ω</div>
                <img src={SKILL_ICONS[skill]} alt={skill} className="level-up-skill-icon" />
                <span className="level-up-text">{level}</span>
            </div>
            <div className="fireworks-container">
                {fireworks.map(fw => (
                    <div key={fw.id} className="firework" style={fw.style}>
                        {fw.particles.map(p => (
                            <div key={p.id} className="firework-particle" style={p.style}></div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LevelUpAnimation;