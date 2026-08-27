// Seeded PRNG, so the same filter always yields the same mock figures.
export function hashString(str) {
  let h = 2166136261
  for (let i = 0; i < str.length; i += 1) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

export function createRng(seed) {
  let a = typeof seed === 'string' ? hashString(seed) : seed >>> 0
  return function rng() {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export const seededFloat = (seed, min, max) => min + createRng(seed)() * (max - min)

export const seededInt = (seed, min, max) => Math.floor(seededFloat(seed, min, max + 1))

export const seededPick = (seed, list) => list[seededInt(seed, 0, list.length - 1)]
