"use server";

import { prisma } from "@/lib/prisma";

export async function trackSlideshowEvent(eventType: string, userId?: string) {
    try {
        await prisma.slideshowEvent.create({
            data: {
                eventType,
                userId,
            },
        });
    } catch (error) {
        console.error("Failed to track slideshow event:", error);
    }
}
