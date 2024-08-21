/* eslint-disable react/jsx-key */
import { Button, types } from "frames.js/next";
import { frames } from "../frames";
import { kv } from "@vercel/kv";

import { Contest } from "../../types";
import { NextRequest } from "next/server";
import { appURL } from "../../utils";

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
  const endDate = new Date(contest.endDate);
  const now = new Date();
  const isContestOver = endDate < now;
  if (isContestOver) {
    return await frames(async (ctx) => {
      return {
        title: "Contest is over",
        image: (
          <div tw="flex flex-col">
            <div tw="flex">Contest is over</div>
          </div>
        ),
        buttons: [
          <Button action="link" target={`${appURL()}`}>
            Create new contest
          </Button>,
          <Button action="post" target={{ pathname: `/results/${contest.id}` }}>
            View results
          </Button>,
        ],
      };
    })(req);
  }

  console.log("contest", contest);

  return await frames(async (ctx) => {
    return {
      title: "Contest",
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
            <div tw="flex text-4xl">{contest.title}</div>
            {contest.description && (
              <div tw="flex mt-8 text-3xl">{contest.description}</div>
            )}
            <div tw="flex mt-8 text-3xl text-center">{`Prize: $${contest.prizeAmount}`}</div>
          </div>
        </div>
      ),
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
