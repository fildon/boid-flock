import { Boid, makeBoid, updateBoid } from "./boid";
import { Vector, distanceBetween, smallestTurn } from "./vector";

const boidCount = 3;

export interface Simulation {
  boids: Boid[];
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  container: HTMLDivElement;
}

export function createSimulation(
  canvas: HTMLCanvasElement,
  container: HTMLDivElement
): Simulation | null {
  const context = canvas.getContext("2d");
  if (!context) {
    console.error(
      "BoidFlock failed to getContext from provided canvas element. Canvas element was:",
      canvas
    );
    return null;
  }
  return {
    boids: createBoids(getWorldSize(container)),
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
    const nearestBoid = getNearestBoid(boid.position, boids, worldSize);
    const targetHeading = nearestBoid?.heading ?? boid.heading;
    const idealTurn = smallestTurn(boid.heading, targetHeading);
    const limitedTurn = Math.max(Math.min(idealTurn, 0.2), -0.2);
    const turningFuzz = 0.05 * (2 * Math.random() - 1);
    const newHeading =
      (((boid.heading + limitedTurn + turningFuzz) % (2 * Math.PI)) +
        2 * Math.PI) %
      (2 * Math.PI);
    return updateBoid(boid, newHeading, worldSize);
  });
}

function getNearestBoid(
  position: Vector,
  boids: Boid[],
  worldSize: Vector
): Boid | null {
  return boids.reduce<[number, Boid | null]>(
    (nearest, currentBoid) => {
      const currentDistance = distanceBetween(
        position,
        currentBoid.position,
        worldSize
      );
      if (currentDistance === 0) return nearest;
      const [nearestDistance] = nearest;
      return currentDistance < nearestDistance
        ? [currentDistance, currentBoid]
        : nearest;
    },
    [Infinity, null]
  )[1];
}

function getWorldSize(container: Element): Vector {
  const { height, width } = container.getBoundingClientRect();
  return { x: width, y: height };
}

function createBoids(worldSize: Vector): Boid[] {
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
  { position: { x, y }, heading }: Boid
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
