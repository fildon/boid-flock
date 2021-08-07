import {
  Vector,
  Polar,
  add,
  addPolar,
  createRandomVector,
  distanceBetween,
  normalizeOnTorus,
  scale,
} from "./vector";

const ALIGNMENT_RADIUS = 40;
const ALIGNMENT_WEIGHT = 15;
const SEPARATION_RADIUS = 15;
const SEPARATION_WEIGHT = 30;

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

export const boidBehaviours: ((
  selfBoid: Boid,
  otherBoids: Boid[],
  worldSize: Vector
) => { vector: Vector; weight: number })[] = [
  separationBehaviour,
  alignmentBehaviour,
];

function separationBehaviour(
  selfBoid: Boid,
  otherBoids: Boid[],
  worldSize: Vector
): { vector: Vector; weight: number } {
  const boidsToAvoid = otherBoids.filter(
    (other) =>
      distanceBetween(other.position, selfBoid.position, worldSize) <
      SEPARATION_RADIUS
  );

  if (boidsToAvoid.length === 0) return { vector: { x: 0, y: 0 }, weight: 0 };

  const averageRepulsionVector = scale(
    boidsToAvoid
      .map(({ position: { x: otherX, y: otherY } }) => ({
        x: otherX - selfBoid.position.x,
        y: otherY - selfBoid.position.y,
      }))
      .reduce((totalVector, currentVector) => add(totalVector, currentVector), {
        x: 0,
        y: 0,
      }),
    1 / boidsToAvoid.length
  );
  return {
    vector: averageRepulsionVector,
    weight: SEPARATION_WEIGHT,
  };
}

function alignmentBehaviour(
  selfBoid: Boid,
  otherBoids: Boid[],
  worldSize: Vector
): { vector: Vector; weight: number } {
  const boidsToAlignTo = otherBoids.filter(
    (other) =>
      distanceBetween(other.position, selfBoid.position, worldSize) <
      ALIGNMENT_RADIUS
  );

  if (boidsToAlignTo.length === 0)
    return {
      vector: { x: 0, y: 0 },
      weight: 0,
    };

  const averageAlignmentVector = scale(
    boidsToAlignTo
      .map((other) => other.course)
      .reduce((acc, curr) => addPolar(acc, curr), { x: 0, y: 0 }),
    1 / boidsToAlignTo.length
  );

  return { vector: averageAlignmentVector, weight: ALIGNMENT_WEIGHT };
}
