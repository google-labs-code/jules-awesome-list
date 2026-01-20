"use client";

import Image from "next/image";

interface PixelCharacterProps {
    type: "notebook" | "lock";
    className?: string;
    size?: number;
    float?: boolean;
}

export default function PixelCharacter({ type, className = "", size = 64, float = true }: PixelCharacterProps) {
    let src = "/assets/notebook.png";
    if (type === "lock") src = "/assets/lock_character.png";

    return (
        <div
            className={`relative inline-block ${float ? "animate-float" : ""} ${className}`}
            style={{ width: size, height: size }}
        >
            <Image
                src={src}
                alt={`Pixel ${type} character`}
                fill
                className="object-contain pixelated"
            />
        </div>
    );
}
