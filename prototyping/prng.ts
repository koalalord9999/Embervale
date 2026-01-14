// Mulberry32, a simple and fast PRNG
export function mulberry32(a: number) {
    return function() {
      let t = a += 0x6D2B79F5;
      t = Math.imul(t ^ t >>> 15, t | 1);
      t ^= t + Math.imul(t ^ t >>> 7, t | 61);
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    }
}

// Simple string hash function to generate the initial seed
function xmur3(str: string) {
    for(var i = 0, h = 1779033703 ^ str.length; i < str.length; i++)
        h = Math.imul(h ^ str.charCodeAt(i), 3432918353),
        h = h << 13 | h >>> 19;
    return function() {
        h = Math.imul(h ^ h >>> 16, 2246822507);
        h = Math.imul(h ^ h >>> 13, 3266489909);
        return (h ^= h >>> 16) >>> 0;
    }
}

const seedGen = xmur3("Embrune");
const GLOBAL_SEED = seedGen();

export function getTileSeed(x: number, y: number): number {
    // A simple way to combine coordinates and a global seed
    // Using prime numbers helps avoid patterns
    return GLOBAL_SEED + (x * 496187) + (y * 567817);
}