export interface Vector {
  x: number;
  y: number;
}

export function createRandomVector({ x: maxX, y: maxY }: Vector): Vector {
  return { x: Math.random() * maxX, y: Math.random() * maxY };
}

export function addPolar(
  { x, y }: Vector,
  heading: number,
  speed: number,
  worldSize: Vector
): Vector {
  return normalize(
    { x: x + speed * Math.cos(heading), y: y + speed * Math.sin(heading) },
    worldSize
  );
}

function normalize({ x, y }: Vector, { x: maxX, y: maxY }: Vector) {
  return { x: ((x % maxX) + maxX) % maxX, y: ((y % maxY) + maxY) % maxY };
}

/**
 * Toroidal taxicab distance
 */
export function distanceBetween(
  v1: Vector,
  v2: Vector,
  { x: maxX, y: maxY }: Vector
): number {
  const xDiff = Math.abs(v1.x - v2.x);
  const toroidalXDiff = Math.min(xDiff, maxX - xDiff);
  const yDiff = Math.abs(v1.y - v2.y);
  const toroidalYDiff = Math.min(yDiff, maxY - yDiff);
  return toroidalXDiff + toroidalYDiff;
}

/**
 * Computes the smallest turn from one heading to another
 * Headings are assumed to be from 0 to 2Pi radians
 * The returned value is between -Pi and +Pi
 */
export function smallestTurn(h1: number, h2: number): number {
  const naiveDiff = h2 - h1;
  if (naiveDiff > Math.PI) return naiveDiff - 2 * Math.PI;
  if (naiveDiff < -Math.PI) return naiveDiff + 2 * Math.PI;
  return naiveDiff;
}
