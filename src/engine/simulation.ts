import { Boid, makeBoid, updateBoid } from "./boid";
import { Vector } from "./vector";

const targetFrameRate = 30;
const boidCount = 10;

export function startSimulation(
  canvas: HTMLCanvasElement,
  container: HTMLDivElement
): void {
  const context = canvas.getContext("2d");
  if (!context) {
    console.error(
      "BoidFlock failed to getContext from provided canvas element. Canvas element was:",
      canvas
    );
    return;
  }
  tick(createBoids(getWorldSize(container)), canvas, context, container);
}

function tick(
  boids: Boid[],
  canvas: HTMLCanvasElement,
  context: CanvasRenderingContext2D,
  container: HTMLDivElement
): void {
  const newBoids = updateBoids(boids, getWorldSize(container));

  renderSimulation(newBoids, canvas, context, container);
  setTimeout(
    () => tick(newBoids, canvas, context, container),
    1000 / targetFrameRate
  );
}

function updateBoids(boids: Boid[], worldSize: Vector): Boid[] {
  return boids.map((boid) => updateBoid(boid, worldSize));
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

  const canvasDataUrl = canvas.toDataURL();
  container.style.background = `url(${canvasDataUrl})`;
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
