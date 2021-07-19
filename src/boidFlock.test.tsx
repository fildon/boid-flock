import * as React from "react";
import { render, screen } from "@testing-library/react";
import { BoidFlock } from ".";

it("says hello", () => {
  render(<BoidFlock message="hello world" />);
  expect(screen.getByText("hello world")).toBeInTheDocument();
});
