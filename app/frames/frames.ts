import { createFrames } from "frames.js/next";

// type State = {
//   counter: number;
// };

export const frames = createFrames({
  basePath: "/frames",
  initialState: {},
  debug: process.env.NODE_ENV === "development",
});
