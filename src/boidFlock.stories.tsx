import * as React from "react";
import { Story, Meta } from "@storybook/react";

import { BoidFlock, BoidFlockProps } from "./boidFlock";

export default {
  title: "BoidFlock",
  component: BoidFlock,
} as Meta;

const DivTemplate: Story<BoidFlockProps> = ({ boidCount }) => (
  <BoidFlock boidCount={boidCount}>
    <div style={{ height: 200, width: 500, border: "1px solid black" }}>
      hello storybook!
    </div>
  </BoidFlock>
);

export const DivStory = DivTemplate.bind({});
DivStory.args = {
  boidCount: 5,
};

const SpanTemplate: Story<BoidFlockProps> = ({ boidCount }) => (
  <BoidFlock boidCount={boidCount}>
    <span>This is just a simple span of text</span>
  </BoidFlock>
);

export const SpanStory = SpanTemplate.bind({});
SpanStory.args = {
  boidCount: 3,
};

const ParagraphTemplate: Story<BoidFlockProps> = ({ boidCount }) => (
  <BoidFlock boidCount={boidCount}>
    <p>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
      tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
      veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
      commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
      velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
      cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id
      est laborum.
    </p>
  </BoidFlock>
);

export const ParagraphStory = ParagraphTemplate.bind({});
ParagraphStory.args = {
  boidCount: 5,
};
