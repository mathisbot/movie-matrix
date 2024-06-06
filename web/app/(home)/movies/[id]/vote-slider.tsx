'use client'

import React from 'react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { voteMovie } from '../actions';
import { VoteMovieResponse } from '@/services/movie';
import { Loader } from 'lucide-react';

const VoteSlider = ({userVote, movieId}: {userVote: number | undefined, movieId: number}) => {
    const [value, setValue] = useState(userVote? userVote : 5);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(parseInt(e.target.value));
    }

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
        "Masterpiece"
     ] as const;
    
    const { data: vote, refetch: reVote, isFetching: isVoting, isFetched: isVoted } = useQuery({
        queryKey: ["search-movies"],
        queryFn: async () => (await voteMovie(movieId, value) as VoteMovieResponse),
        enabled: false,
    });

    const handleClick = () => {
        reVote();
    }

    return (
        <div className='flex flex-col justify-start'>
            {
                userVote !== undefined && (
                    <p className='text-gray-400 mx-3'>Your vote: {adjectiveMap[userVote-1]}</p>
                )
            }
            <div className="my-3 flex flex-row items-center content-center">
                <div className="flex flex-row items-center h-full content-center justify-between w-[250px] mr-4">
                    <div className="text-lg font-medium text-black text-center items-center content-center">
                        <p className="text-center w-[125px]">{adjectiveMap[value-1]}</p>
                    </div>
                    <input
                        type="range"
                        min="1"
                        max="10"
                        step="1"
                        value={value}
                        onChange={handleChange}
                        className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer dark:bg-black"
                    />
                </div>
                <Button onClick={handleClick}>
                    {isVoting ? (
                        <Loader className="mx-3 size-5 animate-spin " />
                    ) : isVoted ? (
                        "Voted!"
                    ) : "Vote"}
                </Button>
            </div>
        </div>
    );
};

export default VoteSlider;
