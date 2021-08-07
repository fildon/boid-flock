import { Boid, makeBoid, updateBoid, boidBehaviours } from "./boid";
import { Vector, scale, toPolar, add, polarToVector } from "./vector";
import { renderSimulation } from "./renderer";

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
  { boidCount = 10 }: SimulationOptions = {}
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

    const idealTargetVector = scale(
      totalVector.weight === 0
        ? polarToVector(boid.course) // No priorities -> use the boid's current course
        : scale(totalVector.vector, 1 / totalVector.weight),
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
