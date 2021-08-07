import { Boid, makeBoid, updateBoid } from "./boid";
import {
  Vector,
  scale,
  toPolar,
  add,
  distanceBetween,
  addPolar,
} from "./vector";

const ALIGNMENT_RADIUS = 40;
const ALIGNMENT_WEIGHT = 15;
const SEPARATION_RADIUS = 15;
const SEPARATION_WEIGHT = 30;
const boidBehaviours: ((
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

interface SimulationOptions {
  boidCount?: number;
}
export interface Simulation {
  boids: Boid[];
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  container: HTMLDivElement;
}

export function createSimulation(
  canvas: HTMLCanvasElement,
  container: HTMLDivElement,
  { boidCount = 3 }: SimulationOptions = {}
): Simulation | undefined {
  const context = canvas.getContext("2d");
  if (!context) {
    console.error(
      "BoidFlock failed to getContext from provided canvas element. Canvas element was:",
      canvas
    );
    return undefined;
  }
  return {
    boids: createBoids(getWorldSize(container), boidCount),
    canvas,
    context,
    container,
  };
}

export function advanceSimulation({
  boids,
  canvas,
  context,
  container,
}: Simulation): Simulation {
  const { x, y } = getWorldSize(container);
  canvas.width = x;
  canvas.height = y;
  const newBoids = updateBoids(boids, { x, y });
  renderSimulation(newBoids, canvas, context, container);
  return { boids: newBoids, canvas, context, container };
}

function updateBoids(boids: Boid[], worldSize: Vector): Boid[] {
  return boids.map((boid) => {
    const otherBoids = boids.filter(
      // We get 'otherBoids' as the set of boids not at our position.
      ({ position: { x, y } }) => boid.position.x !== x || boid.position.y !== y
    );
    const priorities = boidBehaviours.map((behaviour) =>
      behaviour(boid, otherBoids, worldSize)
    );

    const totalVector = priorities.reduce(
      (acc, curr) => {
        return {
          vector: add(acc.vector, scale(curr.vector, curr.weight)),
          weight: acc.weight + curr.weight,
        };
      },
      { vector: { x: 0, y: 0 }, weight: 0 }
    );

    if (totalVector.weight === 0) {
      // TODO do something more interesting when no priorities available.
      /**
       * If we got no priorities, then we continue on current course
       */
      return updateBoid(boid, boid.course, worldSize);
    }

    const idealTargetVector = scale(
      scale(totalVector.vector, 1 / totalVector.weight),
      0.95 // global deceleration desire
    );

    const { length, heading } = toPolar(idealTargetVector);
    const headingFuzz = (2 * Math.random() - 1) * 0.05; // -0.05 to 0.05
    const maximumSpeed = Math.min(boid.course.length + 0.2, 6);
    const minimumSpeed = Math.max(boid.course.length - 0.2, 3);
    const clampedSpeed = Math.max(Math.min(length, maximumSpeed), minimumSpeed);
    const clampedHeading =
      Math.max(
        Math.min(heading + headingFuzz, boid.course.heading + 0.2),
        boid.course.heading - 0.2
      ) %
      (2 * Math.PI);

    return updateBoid(
      boid,
      { length: clampedSpeed, heading: clampedHeading },
      worldSize
    );
  });
}

function getWorldSize(container: Element): Vector {
  const { height, width } = container.getBoundingClientRect();
  return { x: width, y: height };
}

function createBoids(worldSize: Vector, boidCount: number): Boid[] {
  const boids = [];
  for (let i = 0; i < boidCount; i++) {
    boids.push(makeBoid(worldSize));
  }
  return boids;
}

function renderSimulation(
  boids: Boid[],
  canvas: HTMLCanvasElement,
  context: CanvasRenderingContext2D,
  container: HTMLDivElement
): void {
  context.clearRect(0, 0, canvas.width, canvas.height);
  boids.forEach((boid) => paintBoidToCanvas(context, boid));
  container.style.background = `url(${canvas.toDataURL()})`;
}

function paintBoidToCanvas(
  context: CanvasRenderingContext2D,
  boid: Boid
): void {
  paintBoidSegments(context, [boid.position, ...boid.history]);
  paintBeak(context, boid);
}

function paintBoidSegments(
  context: CanvasRenderingContext2D,
  boidSegments: Vector[]
): void {
  const segmentCount = boidSegments.length;
  boidSegments.forEach(({ x, y }, index) => {
    // Tapers segment size as we go down the tail
    const radius = 4 * ((segmentCount - index) / segmentCount);
    context.beginPath();
    context.arc(x, y, radius, 0, 2 * Math.PI);
    context.fillStyle = "blue";
    context.fill();
  });
}

function paintBeak(
  context: CanvasRenderingContext2D,
  { position: { x, y }, course: { heading } }: Boid
): void {
  context.beginPath();
  context.arc(
    x + 5 * Math.cos(heading),
    y + 5 * Math.sin(heading),
    2,
    0,
    2 * Math.PI
  );
  context.fillStyle = "black";
  context.fill();
}
