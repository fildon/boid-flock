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
  return { x: x % maxX, y: y % maxY };
}
