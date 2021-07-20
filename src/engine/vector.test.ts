import { smallestTurn } from "./vector";

describe("smallestTurn", () => {
  test.each([
    [1, 1, 0], // Equality
    [1, 2, 1], // Small positive
    [2, 1, -1], // Small negative
    [1, 5, 4 - Math.PI * 2], // Wrap under
    [5, 1, 2 * Math.PI - 4], // Wrap over
  ])("from %d to %d = %d", (from, to, expected) => {
    expect(smallestTurn(from, to)).toBe(expected);
  });
});
