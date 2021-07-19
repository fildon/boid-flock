import * as React from "react";
import { Story, Meta } from "@storybook/react";

import { BoidFlock, BoidFlockProps } from "./boidFlock";

export default {
  title: "BoidFlock",
  component: BoidFlock,
} as Meta;

const Template: Story<BoidFlockProps> = (args) => <BoidFlock {...args} />;

export const Default = Template.bind({});
Default.args = { message: "hello from storybook" };
