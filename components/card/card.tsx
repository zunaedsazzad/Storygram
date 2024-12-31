"use client";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface CardDemoProps {
    name: string;
    address: string;
    photo: string;
}

export function CardDemo({ name, address, photo }: CardDemoProps) {
    return (
        <div className="max-w-lg w-full group/card">
            <div
                className={cn(
                    "cursor-pointer overflow-hidden relative card h-40 w-full rounded-md shadow-xl mx-auto flex flex-row items-center p-4",
                    "bg-white"
                )}
            >
                <Image
                    height="50"
                    width="50"
                    alt="Avatar"
                    src={photo}
                    className="h-12 w-12 rounded-full border-2 object-cover mr-4"
                />
                <div className="flex flex-col">
                    <p className="font-bold text-lg text-gray-900">
                        {name}
                    </p>
                    <p className="text-sm text-gray-600">
                        {address}
                    </p>
                </div>
            </div>
        </div>
    );
}
