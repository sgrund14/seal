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
  const contest = (await kv.get(`contest:${contestId}`)) as Contest | null;
  const contestVotes = (await kv.hgetall(
    `contest:${contestId}:votes`
  )) as ContestVotes | null;

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
        <div
          tw="flex flex-col p-12 text-center items-center justify-center w-full h-full"
          style={{
            backgroundImage: `url(${contest.image})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div tw="flex flex-col items-center bg-white/80 p-12 rounded-lg">
            <div tw="flex mb-4">{`Results`}</div>
            <ul tw="flex flex-col gap-2">
              {contest.options.filter(Boolean).map((option, index) => (
                <li tw="flex">{`${option}: ${contestVotes[option] || 0}`}</li>
              ))}
            </ul>
          </div>
        </div>
      ),
      buttons: [
        <Button action="post" target={{ pathname: `/${contestId}` }}>
          Back to contest
        </Button>,
      ],
    };
  })(req);
};

export const GET = handler;
export const POST = handler;
