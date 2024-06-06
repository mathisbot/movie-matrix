import React from "react";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { Cast } from "@/services/movie";

export function CastingCard({cast}: {cast: Cast}) {
    return (
        <>
            <div className="flex flex-col gap-4 p-4 content-center items-center text-center">
                <Image src={cast.profileUrl} alt={cast.name} className="w-20 rounded-lg" width="250" height="250"/>
                <div className="flex flex-col justify-center">
                    <h3 className="text-lg font-semibold">{cast.name}</h3>
                    <p className="text-sm text-gray-500">{cast.role}</p>
                </div>
            </div>
        </>
    );
}
