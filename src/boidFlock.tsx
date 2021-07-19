import * as React from "react";

export interface BoidFlockProps {
  /**
   * Simple message string to be rendered
   */
  message: string;
}

/**
 * Renders a lovely message
 */
export function BoidFlock({ message }: BoidFlockProps): JSX.Element {
  return <span>{message}</span>;
}
