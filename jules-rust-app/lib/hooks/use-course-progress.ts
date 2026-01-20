"use client";

import { useCourseContext } from "@/lib/context/course-context";

export function useCourseProgress() {
    return useCourseContext();
}
