/* eslint-disable react/jsx-key */
import { Button, types } from "frames.js/next";
import { frames } from "../../frames";
import { kv } from "@vercel/kv";

import { Contest, ContestVotes } from "../../../types";
import { NextRequest } from "next/server";

const handler = async (
  req: NextRequest,
  { params }: { params: { contestId: string } }
) => {
  const contestId = params.contestId;
  const contest = await kv.get(`contest:${contestId}`) as Contest | null;
  const contestVotes = await kv.hgetall(`contest:${contestId}:votes`) as ContestVotes | null;

  console.log("votes >> ", contestVotes);
  console.log("contest >> ", contest);

  if (!contestVotes || !contest) {
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
      title: `${contest.title} results`,
      image: (
        <div tw="flex flex-col">
          <div tw="flex">{`Results`}</div>
          {contest.options.filter(Boolean).map((option, index) => (
            <div tw="flex">{`${option}: ${contestVotes[option] || 0}`}</div>
          ))}
        </div>
      ),
      buttons: [
        <Button
          action="post"
          target={{ pathname: `/${contestId}` }}
        >
          Back to contest
        </Button>,
      ],
    };
  })(req);
};

export const GET = handler;
export const POST = handler;
