# Boid Flock

A React component to render a boids simulation anywhere

![Demo gif](https://raw.githubusercontent.com/fildon/boid-flock/main/static/boid-flock.gif)

## Installation

```shell
npm add 'boid-flock'
```

## Usage

```ts
import { BoidFlock } from "boid-flock";

export function YourComponent() {
  return (
    <BoidFlock>
      <span>You can render whatever you like in here</span>
    </BoidFlock>
  );
}
```

Optionally you can pass a `boidCount` prop to the component to control the number of boids rendered.

```ts
import { BoidFlock } from "boid-flock";

export function YourComponent() {
  return (
    <BoidFlock boidCount={3}>
      <p>There's only 3 boids in my background</p>
    </BoidFlock>
  );
}
```
