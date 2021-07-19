import * as React from "react";
import { startSimulation } from "./engine/simulation";

export interface BoidFlockProps {
  children?: React.ReactNode;
}

export function BoidFlock({ children }: BoidFlockProps): JSX.Element {
  const containerRef = React.createRef<HTMLDivElement>();
  const canvasRef = React.createRef<HTMLCanvasElement>();

  React.useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;
    startSimulation(canvasRef.current, containerRef.current);
  }, [canvasRef, containerRef]);

  return (
    <div ref={containerRef} style={{ backgroundRepeat: "no-repeat" }}>
      <canvas ref={canvasRef} style={{ display: "none" }} />
      {children}
    </div>
  );
}
