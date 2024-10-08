import { FC } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogTitle } from "./Dialog";
import { Contest } from "../types";
import { Frame } from "./Frame";
import { createExampleURL } from "../utils";
import { Button } from "./Button";

type Props = {
  contest: Contest;
};

const FrameDialog: FC<Props> = ({ contest }) => {
  return (
    <Dialog>
      <DialogTrigger className="bg-[#eee] aspect-square hover:bg-[#ddd] transition-colors duration-300 font-medium flex items-center justify-center rounded-[16px] py-4 px-8">
        {contest.title}
      </DialogTrigger>
      <DialogContent className="pt-10">
        <DialogTitle className="flex justify-between">
          <span>{contest.title}</span>
        </DialogTitle>
        <Frame
          metadata={{
            title: contest.title,
            description: contest.description,
            other: {},
          }}
          url={createExampleURL(`/frames/${contest.id}`)}
        />
        <Button
          onClick={() => {
            window.open(
              `https://warpcast.com/~/compose?embeds[]=${createExampleURL(
                `/frames/${contest.id}`
              )}`,
              "_blank"
            );
          }}
          className="m-auto"
        >
          Post to Warpcast
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default FrameDialog;
