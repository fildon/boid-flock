import * as React from "react";
import {
  Simulation,
  createSimulation,
  advanceSimulation,
} from "./engine/simulation";

export interface BoidFlockProps {
  children?: React.ReactNode;
  boidCount?: number;
}

export function BoidFlock({
  children,
  boidCount,
}: BoidFlockProps): JSX.Element {
  const containerRef = React.createRef<HTMLDivElement>();
  const canvasRef = React.createRef<HTMLCanvasElement>();
  const simulationState = React.useRef<Simulation>();

  React.useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;
    simulationState.current = createSimulation(
      canvasRef.current,
      containerRef.current,
      { boidCount }
    );
    const interval = setInterval(() => {
      if (!simulationState.current) return;
      simulationState.current = advanceSimulation(simulationState.current);
    }, 1000 / 30);
    return () => clearInterval(interval);
  }, [boidCount, canvasRef, containerRef]);

  return (
    <div
      ref={containerRef}
      style={{ backgroundRepeat: "no-repeat", display: "inline-block" }}
    >
      <canvas ref={canvasRef} style={{ display: "none" }} />
      {children}
    </div>
  );
}
