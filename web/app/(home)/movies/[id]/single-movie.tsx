'use client'

import React, { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { CastingCard } from "./casting-card";
import VoteSlider from "./vote-slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Movie } from "@/services/movie";

function convertRuntime(runtime: number) {
  const hours = Math.floor(runtime / 60);
  const minutes = runtime % 60;
  return `${hours}h ${minutes}m`;
}

function formatDate(dateString: string) {
  const months = [
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
  ];

  const [year, month, day] = dateString.split('-');
  const monthName = months[parseInt(month, 10) - 1];

  return `${parseInt(day, 10)} ${monthName} ${year}`;
}

// userVote?: number | undefined;

export default function SingleMovie({ movie }: { movie: Movie }) {
  useEffect(() => {
    const handleScroll = () => {
      const parallax = document.getElementById("parallax");
      if (parallax) {
        const scrolled = window.scrollY;
        parallax.style.transform = `translateY(${scrolled * 0.65 - 35}px)`;
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
      <>
          <div className="relative h-screen overflow-hidden">
              <div
                  id="parallax"
                  className="absolute top-0 left-0 w-full h-full"
                  style={
                      movie.backdropUrl
                          ? {
                                backgroundImage: `url(${movie.backdropUrl})`,
                                backgroundSize: "cover",
                                backgroundAttachment: "fixed",
                            }
                          : {}
                  }
              >
                  <div className="relative z-10 h-full flex items-end">
                      <div className="relative z-10 w-screen h-[200px]">
                          <div className="absolute z-15 inset-0 bg-black opacity-40 w-full h-full"></div>
                          <div className="relative mb-10">
                              <h2 className="text-7xl text-white px-10 mt-4">
                                  <span className="relative z-10">
                                      {movie.title}
                                  </span>
                              </h2>
                              <p className="relative px-10 text-white text-lg">
                                  Rating: {movie.voteAverage.toFixed(1)} /10
                              </p>
                              <p className="relative px-10 text-white text-lg">
                                  Duration: {convertRuntime(movie.runtime)}
                              </p>
                          </div>
                        <Link
                            id="details-link"
                            href="#details-link"
                            className="absolute bottom-10 left-1/2 transform -translate-x-1/2 bg-black text-white p-4 rounded-full shadow-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
                            >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                            </svg>
                        </Link>
                      </div>
                  </div>
              </div>
          </div>
          <div id="details" className="relative z-20 bg-gray-100">
              <div className="flex rounded-xl flex-row p-5 justify-between items-center align-middle">
                  {movie.posterUrl && (
                      <Image
                          src={movie.posterUrl}
                          alt={movie.title}
                          className="mb-4 rounded-xl"
                          width="350"
                          height="525"
                      />
                  )}
                  <div className="ml-2 p-4 h-full w-full">
                      <h2 className="mb-4 text-3xl">{movie.title}</h2>
                      <div className="mb-4 ml-8">
                          <p>Already watched ? Tell us how you liked it:</p>
                          <VoteSlider userVote={movie.userVote? movie.userVote : 5} movieId={movie.id}></VoteSlider>
                      </div>
                      <p className="mb-4 text-lg">
                          ⭐ {movie.voteAverage.toFixed(1)} / 10
                      </p>
                      <p className="mb-4 text-lg">
                          🕰️ {convertRuntime(movie.runtime)}
                      </p>
                      <p className="mb-4 text-lg">
                          📅 {formatDate(movie.releaseDate)}
                      </p>
                      <p className="mb-4 text-lg">
                          🎬 {movie.genres.join(", ")}
                      </p>
                      <Tabs defaultValue="synopsis">
                          <TabsList>
                              <TabsTrigger value="synopsis">
                                  📖 Synopsis
                              </TabsTrigger>
                              <TabsTrigger value="casting">
                                  🙋 Casting
                              </TabsTrigger>
                          </TabsList>
                          <TabsContent value="synopsis" className="max-w-full">
                              <Card className="w-full p-3 bg-white">
                                  <p className="mb-4 text-justify">
                                      {movie.overview}
                                  </p>
                              </Card>
                          </TabsContent>
                          <TabsContent value="casting">
                              <Card className="w-full p-3 bg-white">
                                  <ul className="flex flex-row flex-wrap w-full">
                                      {movie.casting.map((cast, index) => (
                                          <li key={index}>
                                              <CastingCard cast={cast} />
                                          </li>
                                      ))}
                                  </ul>
                              </Card>
                          </TabsContent>
                      </Tabs>
                  </div>
              </div>
          </div>
          <div id="details" className="relative z-20">
          <div className="relative mb-10">
                              <h2 className="text-4xl text-black px-12 mt-8 mb-8">
                                  <span className="relative z-10">
                                      You may also like:
                                  </span>
                              </h2>
                              <Card className="w-full p-3 bg-white px-20">
                                  <ul className="grid grid-flow-row w-full">
                                      {movie.casting.map((cast, index) => (
                                          <li key={index}>
                                              <CastingCard cast={cast} />
                                          </li>
                                      ))}
                                  </ul>
                              </Card>
                          </div>
          </div>
      </>
  );
}
