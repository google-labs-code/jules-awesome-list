"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function signup(currentState: any, formData: FormData) {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const name = formData.get("name") as string;

    if (!email || !password || !name) {
        return { error: "All fields are required" };
    }

    try {
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return { error: "User already exists" };
        }

        // In a real app, hash the password!
        await prisma.user.create({
            data: {
                email,
                password, // Not hashed for this demo as requested
                name,
            },
        });

    } catch (error) {
        console.error("Signup error:", error);
        return { error: "Failed to create account" };
    }

    redirect("/login");
}
