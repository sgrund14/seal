import { fetchMetadata } from "frames.js/next";
import type { Metadata } from "next";
import { createExampleURL } from "./utils";
import { kv } from "@vercel/kv";
import { Contest } from "./types";
import { ContestsEntry } from "./components/ContestsEntry";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "frames.js starter",
    description: "This is a frames.js starter template",
    other: {
      ...(await fetchMetadata(createExampleURL("/frames"))),
    },
  };
}

// This is a react server component only
export default async function Home() {
  const contests = await kv.lrange("contests", 0, -1);
  const initContests = (
    await Promise.all(
      contests.map(async (contest) => {
        const contestData = await kv.get(`contest:${contest}`);
        return contestData as Contest;
      })
    )
  ).filter(Boolean);

  return (
    <ContestsEntry initContests={initContests} />
  );
}
