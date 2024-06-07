"use client";

import { startTransition, useOptimistic, useState } from "react";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { voteMovie } from "../actions";
import { Loader } from "lucide-react";

const VoteSlider = ({
  userVote,
  movieId,
}: {
  userVote: number | undefined;
  movieId: number;
}) => {
  const [value, setValue] = useState(userVote ?? 5);

  const adjectiveMap = [
    "Appalling",
    "Horrible",
    "Very Bad",
    "Bad",
    "Average",
    "Fine",
    "Good",
    "Very good",
    "Great",
    "Masterpiece",
  ] as const;

  const userVoteMutation = useMutation({
    mutationFn: (value: number) => voteMovie(movieId, value),
  });

  return (
    <div className="flex flex-col justify-start">
      {userVote !== undefined && (
        <p className="text-gray-400 mx-3">
          Your vote: {adjectiveMap[value - 1]}
        </p>
      )}
      <div className="my-3 flex flex-row items-center content-center">
        <div className="flex flex-row items-center h-full content-center justify-between w-[250px] mr-4">
          <div className="text-lg font-medium text-black text-center items-center content-center">
            <p className="text-center w-[125px]">{adjectiveMap[value - 1]}</p>
          </div>
          <input
            type="range"
            min="1"
            max="10"
            step="1"
            value={value}
            onChange={(e) => setValue(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-300 rounded-full appearance-none cursor-pointer dark:bg-black"
          />
        </div>
        <Button
          onClick={() => {
            startTransition(() => {
              userVoteMutation.mutate(value);
            });
          }}
        >
          {userVoteMutation.isPending ? (
            <Loader className="mx-3 size-5 animate-spin " />
          ) : userVoteMutation.isSuccess ? (
            "Voted!"
          ) : (
            "Vote"
          )}
        </Button>
      </div>
    </div>
  );
};

export default VoteSlider;
