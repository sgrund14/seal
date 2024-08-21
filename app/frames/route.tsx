/* eslint-disable react/jsx-key */

import { Button } from "frames.js/next";
import { frames } from "./frames";

const handler = frames(async (ctx) => {
  return {
    image: <div>No contest selected</div>,
  };
});

export const GET = handler;
export const POST = handler;
