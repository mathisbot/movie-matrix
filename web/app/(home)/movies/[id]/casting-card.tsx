import React from "react";
import Image from "next/image";
import { Cast } from "@/services/movie";

export function CastingCard({ cast }: { cast: Cast }) {
  return (
    <>
      <div className="flex flex-col gap-2 p-2 content-center items-center text-center">
        <Image
          src={cast.profileUrl}
          alt={cast.name}
          className="w-20 rounded-md"
          width="250"
          height="250"
        />
        <div className="flex flex-col justify-center">
          <h3 className="text-lg font-semibold">{cast.name}</h3>
          <p className="text-sm text-gray-500">{cast.role}</p>
        </div>
      </div>
    </>
  );
}
