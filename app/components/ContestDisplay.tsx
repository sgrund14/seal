"use client";

import { FC } from "react";
import { Contest } from "../types";
import FrameDialog from "./FrameDialog";

type Props = {
  contests: Contest[];
};

export const ContestDisplay: FC<Props> = ({ contests }) => {

  return (
    <div className="flex flex-col gap-4 items-center">
      <h2 className="text-lg font-medium">Past Contests</h2>
      <div className="grid grid-cols-3 gap-4">
        {contests.map((contest) => (
          <FrameDialog key={contest.id} contest={contest} />
        ))}
      </div>
    </div>
  );
};
