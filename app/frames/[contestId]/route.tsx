/* eslint-disable react/jsx-key */
import { Button, types } from "frames.js/next";
import { frames } from "../frames";
import { kv } from "@vercel/kv";

import { Contest } from "../../types";
import { NextRequest } from "next/server";

const handler = async (
  req: NextRequest,
  { params }: { params: { contestId: string } }
) => {
  const contestId = params.contestId;
  const contest = (await kv.get(`contest:${contestId}`)) as Contest | null;

  if (!contest) {
    // return nextjs not found
    return await frames(async (ctx) => {
      return {
        title: "Contest not found",
        image: (
          <div tw="flex flex-col">
            <div tw="flex">Contest not found</div>
          </div>
        ),
      };
    })(req);
  }

  return await frames(async (ctx) => {
    return {
      title: "Contest",
      image: (
        <div tw="flex flex-col">
          <div tw="flex">{contest.title}</div>
          {contest.description && <div tw="flex">{contest.description}</div>}
        </div>
      ),
      textInput:
        ctx.searchParams.action === "create" ? "Contest name" : undefined,
      buttons: contest.options.filter(Boolean).map((option, index) => (
        <Button
          action="post"
          target={{ pathname: `/vote/${contest.id}`, query: { option } }}
        >
          {option}
        </Button>
      )),
      state: {},
    };
  })(req);
};

export const GET = handler;
export const POST = handler;
