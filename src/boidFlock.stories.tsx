import * as React from "react";
import { Story, Meta } from "@storybook/react";

import { BoidFlock, BoidFlockProps } from "./boidFlock";

export default {
  title: "BoidFlock",
  component: BoidFlock,
} as Meta;

const Template: Story<BoidFlockProps> = ({ children }) => (
  <BoidFlock>{children}</BoidFlock>
);

export const DivWithAString = Template.bind({});
DivWithAString.args = {
  children: (
    <div style={{ height: 200, border: "1px solid black" }}>
      hello storybook!
    </div>
  ),
};

export const TextArea = Template.bind({});
TextArea.args = {
  children: <textarea />,
};
