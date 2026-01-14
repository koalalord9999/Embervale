import { isoToScreen, TILE_HEIGHT } from './isoUtils';
import { PlayerModel } from './playerModel';
// FIX: The `Equipment` and `WeaponType` types are exported from the main `types` barrel file, not from `constants`. This commit updates the import path to resolve the module resolution error.
import { Equipment, WeaponType } from '../types';
import { ITEMS } from '../constants';

type HairStyle = 'bald' | 'short' | 'long';
type FacialHair = 'none' | 'beard' | 'mustache';

interface HumanoidOptions {
    skinColor?: string;
    hairColor?: string;
    hairStyle?: HairStyle;
    facialHair?: FacialHair;
    shirtColor?: string;
    pantsColor?: string;
    aiType?: 'smart' | 'basic';
    leashRange?: number;
}

export class HumanoidModel extends PlayerModel {
    id: string;
    skinColor: string;
    hairColor: string;
    hairStyle: HairStyle;
    facialHair: FacialHair;
    shirtColor: string;
    pantsColor: string;
    name: string;
    state: 'idle' | 'wandering' | 'chasing' | 'dead' = 'idle';
    wanderCooldown: number = 0;
    spawnX: number;
    spawnY: number;
    lastPathTimestamp: number = 0;
    aiType: 'smart' | 'basic';
    aggroTargetId: string | null = null;
    aggroTimeout: number = 0;
    leashRange: number;
    hp: number;
    maxHp: number;

    constructor(id: string, startX: number, startY: number, name: string, options: HumanoidOptions = {}) {
        super(startX, startY);
        this.id = id;
        this.name = name;
        this.skinColor = options.skinColor || '#fca5a5';
        this.hairColor = options.hairColor || '#4b5563';
        this.hairStyle = options.hairStyle || 'short';
        this.facialHair = options.facialHair || 'none';
        this.shirtColor = options.shirtColor || '#ef4444';
        this.pantsColor = options.pantsColor || '#1f2937';
        this.spawnX = startX;
        this.spawnY = startY;
        this.wanderCooldown = Math.random() * 5000 + 2000;
        this.aiType = options.aiType || 'basic';
        this.leashRange = options.leashRange || 8;
        this.hp = 0;
        this.maxHp = 0;
    }

    draw(ctx: CanvasRenderingContext2D, originX: number, originY: number, zoom: number = 1) {
        if (this.state === 'dead') return;
        
        const screenPos = isoToScreen(this.visualX, this.visualY, originX, originY);
        const x = screenPos.x;
        const y = screenPos.y + TILE_HEIGHT / 2; 

        const isMoving = this.path.length > 0;
        const bounce = isMoving ? Math.abs(Math.sin(Date.now() / 100)) * 5 : 0;

        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.beginPath();
        ctx.ellipse(x, y, 10, 5, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.save();
        ctx.translate(x, y - bounce);

        ctx.fillStyle = this.pantsColor;
        ctx.fillRect(-4, -12, 3, 12);
        ctx.fillRect(1, -12, 3, 12);
        
        ctx.fillStyle = this.shirtColor;
        ctx.fillRect(-6, -24, 12, 14);

        ctx.fillStyle = this.skinColor;
        ctx.beginPath();
        ctx.arc(0, -29, 6, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = 'black';
        ctx.fillRect(-2, -30, 1, 2);
        ctx.fillRect(2, -30, 1, 2);

        ctx.fillStyle = this.hairColor;
        if (this.hairStyle === 'short') {
             ctx.beginPath();
             ctx.arc(0, -32, 6, Math.PI, 0);
             ctx.fill();
        } else if (this.hairStyle === 'long') {
             ctx.beginPath();
             ctx.arc(0, -32, 6, Math.PI, 0);
             ctx.lineTo(6, -24);
             ctx.lineTo(-6, -24);
             ctx.fill();
        }

        if (this.facialHair === 'beard') {
             ctx.beginPath();
             ctx.arc(0, -29, 6, 0, Math.PI);
             ctx.fill();
        } else if (this.facialHair === 'mustache') {
             ctx.fillRect(-3, -26, 6, 2);
        }

        ctx.restore();

        ctx.fillStyle = 'white';
        ctx.font = `${10 / zoom}px Arial`;
        ctx.textAlign = 'center';
        ctx.shadowColor = 'black';
        ctx.shadowBlur = 2;
        ctx.fillText(this.name, x, y - 45 - bounce);
        ctx.shadowBlur = 0;
    }
}