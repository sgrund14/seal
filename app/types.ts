export type Contest = {
  title: string;
  description: string;
  id: string;
  image: string;
  prizeAmount: number;
  endDate: string;
  options: string[];
};

export type ContestVotes = {
  [key: string]: number;
};
