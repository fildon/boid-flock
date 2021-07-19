import * as React from "react";

export interface BoidFlockProps {
  message: string;
}

export function BoidFlock({ message }: BoidFlockProps): JSX.Element {
  return <span>{message}</span>;
}
