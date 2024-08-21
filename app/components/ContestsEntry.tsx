"use client";

import { kv } from "@vercel/kv";
import { FC, useCallback, useState } from "react";
import { Contest } from "../types";
import { CreateDialog } from "./CreateDialog";
import { ContestDisplay } from "./ContestDisplay";
import { Toaster } from "sonner";

type Props = {
  initContests: Contest[];
};

export const ContestsEntry: FC<Props> = ({ initContests }) => {
  const [contests, setContests] = useState<Contest[]>(initContests);

  const refreshContests = useCallback(async () => {
    const contests = await kv.lrange("contests", 0, -1);
    const newContests = (
      await Promise.all(
        contests.map(async (contest) => {
          const contestData = await kv.get(`contest:${contest}`);
          return contestData as Contest;
        })
      )
    ).filter(Boolean);
    setContests(newContests);
  }, []);

  return (
    <>
      <div className="flex flex-col max-w-[600px] w-full gap-12 mx-auto p-2 justify-center items-center min-h-screen">
        <h1 className="text-2xl font-semibold flex gap-4 items-center">
          <span>⭐️</span>The Kramer Contest Creator<span>⭐️</span>
        </h1>
        <CreateDialog onSuccess={refreshContests} />
        {contests.length > 0 && <ContestDisplay contests={contests} />}
      </div>
      <Toaster richColors />
    </>
  );
};
