import { isoToScreen, TILE_HEIGHT } from './isoUtils';
// FIX: The `Equipment` and `WeaponType` types are exported from the main `types` barrel file, not from `constants`. This commit updates the import path to resolve the module resolution error.
import { Equipment, WeaponType } from '../types';
import { ITEMS } from '../constants';

const getMaterialColor = (material: string | undefined): { main: string; shadow: string } => {
    switch (material) {
        case 'bronze': return { main: '#a16207', shadow: '#78350f' };
        case 'iron': return { main: '#6b7280', shadow: '#4b5563' };
        case 'steel': return { main: '#d1d5db', shadow: '#9ca3af' };
        case 'mithril': return { main: '#93c5fd', shadow: '#60a5fa' };
        case 'adamantite': return { main: '#166534', shadow: '#14532d' };
        case 'runic': return { main: '#a78bfa', shadow: '#8b5cf6' };
        default: return { main: '#9ca3af', shadow: '#6b7280' };
    }
};

export class PlayerModel {
    // Logical Grid Position (Integers)
    gridX: number;
    gridY: number;

    // Visual Screen Position (Floats for smooth interpolation)
    visualX: number;
    visualY: number;

    // Movement State
    path: { x: number, y: number }[] = [];
    progress: number = 0;
    speed: number = 250; // ms per tile
    lastPathTimestamp: number = 0;

    constructor(startX: number, startY: number) {
        this.gridX = startX;
        this.gridY = startY;
        this.visualX = startX;
        this.visualY = startY;
    }

    setPath(newPath: { x: number, y: number }[]) {
        this.path = newPath;
        this.progress = 0;
    }

    update(deltaTime: number) {
        if (this.path.length > 0) {
            const nextTile = this.path[0];
            
            this.progress += deltaTime / this.speed;

            if (this.progress >= 1) {
                this.gridX = nextTile.x;
                this.gridY = nextTile.y;
                this.path.shift();
                this.progress = 0;
            }
            
            const fromX = this.path.length === 0 ? this.gridX : this.gridX;
            const fromY = this.path.length === 0 ? this.gridY : this.gridY;
            const toX = this.path.length > 0 ? this.path[0].x : this.gridX;
            const toY = this.path.length > 0 ? this.path[0].y : this.gridY;
            
            this.visualX = this.lerp(fromX, toX, this.progress);
            this.visualY = this.lerp(fromY, toY, this.progress);
        } else {
            this.visualX = this.gridX;
            this.visualY = this.gridY;
        }
    }

    draw(ctx: CanvasRenderingContext2D, originX: number, originY: number, zoom: number = 1, equipment: Equipment) {
        const screenPos = isoToScreen(this.visualX, this.visualY, originX, originY);
        const x = screenPos.x;
        const y = screenPos.y + TILE_HEIGHT / 2;

        const isMoving = this.path.length > 0;
        const bounce = isMoving ? Math.abs(Math.sin(Date.now() / 100)) * 5 : 0;
        const sway = isMoving ? Math.sin(Date.now() / 200) * 3 : 0;

        // Shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.beginPath();
        ctx.ellipse(x, y, 10, 5, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.save();
        ctx.translate(x, y - bounce);

        // -- DRAWING LOGIC --
        const weapon = equipment.weapon ? ITEMS[equipment.weapon.itemId] : null;
        const shield = equipment.shield ? ITEMS[equipment.shield.itemId] : null;
        const shirtColor = '#3b82f6';
        
        // Legs
        ctx.fillStyle = '#1f2937';
        ctx.fillRect(-4, -12, 3, 12); // Left
        ctx.fillRect(1, -12, 3, 12);  // Right

        // Left Arm (behind body)
        ctx.save();
        ctx.translate(-5, -22);
        ctx.rotate(sway * Math.PI / 180);
        ctx.fillStyle = shirtColor;
        ctx.fillRect(-2, 0, 4, 10);
        
        // Shield
        if (shield) {
            ctx.translate(0, 8); // Move to hand
            const shieldColors = getMaterialColor(shield.material);
            ctx.fillStyle = shieldColors.main;
            ctx.strokeStyle = shieldColors.shadow;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(-8, -12); ctx.lineTo(8, -12); ctx.lineTo(8, 6); ctx.lineTo(0, 12); ctx.lineTo(-8, 6);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
        }
        ctx.restore();

        // Torso
        ctx.fillStyle = shirtColor;
        ctx.fillRect(-6, -24, 12, 14);

        // Right Arm (in front of body)
        ctx.save();
        ctx.translate(5, -22);
        ctx.rotate(-sway * Math.PI / 180);
        ctx.fillStyle = shirtColor;
        ctx.fillRect(-2, 0, 4, 10);

        // Weapon
        if (weapon && weapon.equipment?.weaponType === WeaponType.Sword) {
            ctx.translate(0, 8);
            ctx.rotate(20 * Math.PI / 180);
            const swordColors = getMaterialColor(weapon.material);
            
            // Blade
            const gradient = ctx.createLinearGradient(-2, 0, 2, 0);
            gradient.addColorStop(0, swordColors.shadow);
            gradient.addColorStop(0.5, swordColors.main);
            gradient.addColorStop(1, swordColors.shadow);
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.moveTo(0, 0); ctx.lineTo(2, -25); ctx.lineTo(0, -30); ctx.lineTo(-2, -25);
            ctx.closePath();
            ctx.fill();
            
            // Hilt
            ctx.fillStyle = '#a16207';
            ctx.fillRect(-5, 0, 10, 2);
            
            // Pommel
            ctx.fillStyle = '#f59e0b';
            ctx.beginPath();
            ctx.arc(0, 3, 2, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.restore();

        // Head
        ctx.fillStyle = '#fca5a5';
        ctx.beginPath();
        ctx.arc(0, -29, 6, 0, Math.PI * 2);
        ctx.fill();

        // Eyes
        ctx.fillStyle = 'black';
        ctx.fillRect(-2, -30, 1, 2);
        ctx.fillRect(2, -30, 1, 2);
        
        // Hair
        ctx.fillStyle = '#4b5563';
        ctx.beginPath();
        ctx.arc(0, -32, 6, Math.PI, 0);
        ctx.fill();

        ctx.restore();

        // Name Tag
        ctx.fillStyle = 'white';
        ctx.font = `${10 / zoom}px Arial`;
        ctx.textAlign = 'center';
        ctx.shadowColor = 'black';
        ctx.shadowBlur = 2;
        ctx.fillText("Player", x, y - 45 - bounce);
        ctx.shadowBlur = 0;
    }

    private lerp(start: number, end: number, t: number) {
        return start + (end - start) * t;
    }
}