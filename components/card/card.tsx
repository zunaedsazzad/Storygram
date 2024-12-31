"use client";
import { cn } from "@/lib/utils";
import Image from "next/image";

export function CardDemo() {
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
                    src="/manu.png"
                    className="h-12 w-12 rounded-full border-2 object-cover mr-4"
                />
                <div className="flex flex-col">
                    <p className="font-bold text-lg text-gray-900">
                        Manu Arora
                    </p>
                    <p className="text-sm text-gray-600">
                        1234 Elm Street, Springfield, IL
                    </p>
                </div>
            </div>
        </div>
    );
}
