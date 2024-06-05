'use client'

import React, { useEffect } from "react";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { CastingCard } from "./casting-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";

function convertRuntime(runtime: number) {
  const hours = Math.floor(runtime / 60);
  const minutes = runtime % 60;
  return `${hours}h ${minutes}m`;
}

export default function SingleMovie({ movie }: { movie: Movie }) {
  useEffect(() => {
    const handleScroll = () => {
      const parallax = document.getElementById("parallax");
      if (parallax) {
        const scrolled = window.scrollY;
        parallax.style.transform = `translateY(${scrolled * 0.5 - 35}px)`;
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
            <div className="relative z-10 w-screen">
                <div className="absolute z-15 inset-0 bg-black opacity-35 w-full"></div>
              <h2 className="relative text-7xl text-white mb-10 p-10">
                {/* <span className="absolute inset-0 bg-black opacity-50 z-0 rounded-lg h-full w-screen"></span> */}
                <span className="relative z-10">{movie.title}</span>
              </h2>
            </div>
          </div>
        </div>
      </div>
      <div className="relative z-20 bg-white">
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
            <h2 className="mb-4 text-xl">{movie.title}</h2>
            <p className="mb-4">⭐ Rating: {movie.voteAverage.toFixed(1)} /10</p>
            <div className="mb-4 ml-8">
                <p>Did you like it ?</p>
                <div className="my-3 flex flex-row w-screen">
                    <Button>Vote</Button>
                    <Slider min={1} max={10} step={1} className="w-[20rem] ml-3"></Slider>
                </div>
            </div>
            <p className="mb-4">🕰️ Duration: {convertRuntime(movie.runtime)}</p>
            <Tabs defaultValue="synopsis">
              <TabsList>
                <TabsTrigger value="synopsis">Synopsis</TabsTrigger>
                <TabsTrigger value="casting">🙋 Casting</TabsTrigger>
              </TabsList>
              <TabsContent value="synopsis" className="max-w-full">
                <Card className="w-full p-3 bg-gray-100">
                  <p className="mb-4 text-justify">{movie.overview}</p>
                </Card>
              </TabsContent>
              <TabsContent value="casting">
                <Card className="w-full p-3 bg-gray-100">
                  <ul className="grid grid-flow-row w-full">
                    {movie.casting.map((actor, index) => (
                      <li key={index}>{JSON.stringify(actor)}</li>
                    ))}
                  </ul>
                  <CastingCard posterUrl="" name="" role="" />
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </>
  );
}
