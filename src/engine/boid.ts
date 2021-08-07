import {
  Vector,
  Polar,
  createRandomVector,
  addPolar,
  normalizeOnTorus,
} from "./vector";

export interface Boid {
  position: Vector;
  course: Polar;
  history: Vector[];
}

export function makeBoid(worldSize: Vector): Boid {
  return {
    position: createRandomVector(worldSize),
    course: { heading: 2 * Math.PI * Math.random(), length: 6 },
    history: [],
  };
}

export function updateBoid(
  { position, course, history }: Boid,
  newCourse: Polar,
  worldSize: Vector
): Boid {
  const newPosition = normalizeOnTorus(addPolar(position, course), worldSize);
  const newHistory = [position, ...history].slice(0, 5);
  return {
    position: newPosition,
    course: newCourse,
    history: newHistory,
  };
}
