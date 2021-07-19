import * as React from "react";
import { Story, Meta } from "@storybook/react";

import { BoidFlock, BoidFlockProps } from "./boidFlock";

export default {
  title: "BoidFlock",
  component: BoidFlock,
} as Meta;

const Template: Story<BoidFlockProps> = () => (
  <BoidFlock>
    <div style={{ height: "100px" }}>hello storybook!</div>
  </BoidFlock>
);

export const Default = Template.bind({});
