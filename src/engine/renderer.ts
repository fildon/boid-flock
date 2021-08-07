import { Boid } from "./boid";
import { Vector } from "./vector";

export function renderSimulation(
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
