export interface Vector {
  x: number;
  y: number;
}

export interface Polar {
  heading: number;
  length: number;
}

export function createRandomVector({ x: maxX, y: maxY }: Vector): Vector {
  return { x: Math.random() * maxX, y: Math.random() * maxY };
}

function polarToVector({ heading, length }: Polar): Vector {
  return { x: length * Math.cos(heading), y: length * Math.sin(heading) };
}

export function addPolar(vector: Vector, polar: Polar): Vector {
  return add(vector, polarToVector(polar));
}

export function add(v1: Vector, v2: Vector): Vector {
  return { x: v1.x + v2.x, y: v1.y + v2.y };
}

export function normalizeOnTorus(
  { x, y }: Vector,
  { x: maxX, y: maxY }: Vector
): Vector {
  return { x: ((x % maxX) + maxX) % maxX, y: ((y % maxY) + maxY) % maxY };
}

function vectorTo(from: Vector, to: Vector, worldSize?: Vector): Vector {
  if (!worldSize) return { x: to.x - from.x, y: to.y - from.y };
  const { x: maxX, y: maxY } = worldSize;
  let nearestX = (to.x - from.x) % maxX;
  if (nearestX > maxX / 2) {
    nearestX -= maxX;
  }
  if (nearestX < -(maxX / 2)) {
    nearestX += maxX;
  }
  let nearestY = (to.y - from.y) % maxY;
  if (nearestY > maxY / 2) {
    nearestY -= maxY;
  }
  if (nearestY < -(maxY / 2)) {
    nearestY += maxY;
  }
  return { x: nearestX, y: nearestY };
}

export function distanceBetween(
  v1: Vector,
  v2: Vector,
  { x: maxX, y: maxY }: Vector
): number {
  return length(vectorTo(v1, v2, { x: maxX, y: maxY }));
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

export function toPolar({ x, y }: Vector): Polar {
  return { heading: Math.atan2(y, x), length: length({ x, y }) };
}

export function scale({ x, y }: Vector, scale: number): Vector {
  return { x: x * scale, y: y * scale };
}

function length({ x, y }: Vector): number {
  return Math.sqrt(x * x + y * y);
}
