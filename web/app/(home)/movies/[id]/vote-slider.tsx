'use client'

import React from 'react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { voteMovie } from '../actions';
import { VoteMovieResponse } from '@/services/movie';
import { Loader } from 'lucide-react';

const VoteSlider = ({userVote, movieId}: {userVote: number, movieId: number}) => {
    const [value, setValue] = useState(userVote);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(parseInt(e.target.value));
    }

    const adjectiveMap = {
        1: "Appalling",
        2: "Horrible",
        3: "Very Bad",
        4: "Bad",
        5: "Average",
        6: "Fine",
        7: "Good",
        8: "Very good",
        9: "Great",
        10: "Masterpiece"
      };
    
    const { data: vote, refetch: reVote, isFetching: isVoting, isFetched: isVoted } = useQuery({
        queryKey: ["search-movies"],
        queryFn: async () => (await voteMovie(movieId, value) as VoteMovieResponse),
        enabled: false,
    });

    const handleClick = () => {
        reVote();
    }

    return (
        <div className="my-3 flex flex-row items-center content-center">
            <div className="flex flex-row items-center space-x-4 h-full content-center justify-between w-[250px] mx-4">
                <div className="m-0 text-lg font-medium text-black text-center items-center content-center">
                    {value}
                </div>
                <input
                    type="range"
                    min="1"
                    max="10"
                    step="1"
                    value={value}
                    onChange={handleChange}
                    className="w-full m-0 h-2 bg-gray-300 rounded-full appearance-none cursor-pointer dark:bg-black"
                />
                <p className="w-full text-center">{adjectiveMap[value]}</p>
            </div>
            <Button onClick={handleClick}>
                {isVoting ? (
                    <Loader className="mx-3 size-5 animate-spin " />
                ) : isVoted ? (
                    "Voted!"
                ) : "Vote"}
            </Button>
        </div>
    );
};

export default VoteSlider;
