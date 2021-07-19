import { Vector, createRandomVector, addPolar } from "./vector";

export interface Boid {
  position: Vector;
  heading: number;
  speed: number;
  history: Vector[];
}

export function makeBoid(worldSize: Vector): Boid {
  return {
    position: createRandomVector(worldSize),
    heading: 2 * Math.PI * Math.random(),
    speed: 6,
    history: [],
  };
}

export function updateBoid(
  { position, heading, speed, history }: Boid,
  worldSize: Vector
): Boid {
  const newPosition = addPolar(position, heading, speed, worldSize);
  const newHistory = [position, ...history].slice(0, 5);
  return {
    position: newPosition,
    heading, // TODO
    speed, // TODO
    history: newHistory,
  };
}
