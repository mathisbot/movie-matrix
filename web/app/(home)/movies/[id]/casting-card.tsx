import React from "react";
import { Card } from "@/components/ui/card";
import Image from "next/image";

export function CastingCard({posterUrl, name, role}: {posterUrl: string, name: string, role: string}) {
    return (
        <>
            <Card className="flex flex-row gap-4 p-4">
                <Image src={posterUrl} alt={name} className="w-20 h-20 rounded-lg" width="20" height="20"/>
                <div className="flex flex-col justify-center">
                    <h3 className="text-lg font-semibold">{name}</h3>
                    <p className="text-sm text-gray-500">{role}</p>
                </div>
            </Card>
        </>
    );
}
