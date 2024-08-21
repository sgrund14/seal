/* eslint-disable react/jsx-key */
import { Button, types } from "frames.js/next";
import { frames } from "../../frames";
import { kv } from "@vercel/kv";

import { Contest } from "../../../types";
import { NextRequest } from "next/server";
import { farcasterHubContext } from "frames.js/middleware";

const handler = async (
  req: NextRequest,
  { params }: { params: { contestId: string } }
) => {
  const contestId = params.contestId;
  const contest = await kv.get(`contest:${contestId}`) as Contest | null;

  if (!contest) {
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
    
    const option = ctx.searchParams.option;
    if (option) {
      const voteKey = `contest:${contestId}:votes`;
      const requesterFid = ctx.message?.requesterFid;
      const hasVoted = await kv.sismember(`contest:${contestId}:voters`, requesterFid);
      const userVotes = await kv.hgetall(`user:${requesterFid}:votes`);
      
      if (hasVoted) {
        return {
          title: `Vote for ${contest.title}`,
          image: (
            <div tw="flex flex-col">
              <div tw="flex">{`You have already voted: ${userVotes?.[contestId]}`}</div>
            </div>
          ),
          buttons: [
            <Button
              action="post"
              target={{ pathname: `/results/${contestId}` }}
            >
              View results
            </Button>,
          ],
        };
      }
      
      await kv.hincrby(voteKey, option, 1);
      // keep a set of users who have voted
      await kv.sadd(`contest:${contestId}:voters`, requesterFid);
      // record what option a user voted for in this contest
      await kv.hset(`user:${requesterFid}:votes`, { [contestId]: option });

    } else {
      return {
        title: `Vote for ${contest.title}`,
        image: (
          <div tw="flex flex-col">
            <div tw="flex">No option selected</div>
          </div>
        ),
      };
    }

    const query = ctx.searchParams;
    
    return {
      title: `Vote for ${contest.title}`,
      image: (
        <div tw="flex flex-col">
          <div tw="flex">{`You voted: ${query.option}`}</div>
        </div>
      ),
      buttons: [
        <Button
          action="post"
          target={{ pathname: `/results/${contestId}` }}
        >
          View results
        </Button>,
      ],
      middleware: [farcasterHubContext()],
    };
  })(req);
};

export const GET = handler;
export const POST = handler;
