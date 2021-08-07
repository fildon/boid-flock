import * as React from "react";
import { Story, Meta } from "@storybook/react";

import { BoidFlock, BoidFlockProps } from "./boidFlock";

export default {
  title: "BoidFlock",
  component: BoidFlock,
} as Meta;

const DivTemplate: Story<BoidFlockProps> = ({ boidCount }) => (
  <BoidFlock boidCount={boidCount}>
    {
      <div style={{ height: 200, width: 500, border: "1px solid black" }}>
        hello storybook!
      </div>
    }
  </BoidFlock>
);

export const DivStory = DivTemplate.bind({});
DivStory.args = {
  boidCount: 5,
};
