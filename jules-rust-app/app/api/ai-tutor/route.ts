import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { message, context } = await req.json();

        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            return NextResponse.json({
                response: "I'm currently in offline mode (API Key missing). But I can tell you that " + message + " is a great question! In a real scenario, I'd explain it with math context.",
            });
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const systemPrompt = `
You are an expert AI Mathematics Tutor for a course called "Essential Math for AI".
Your goal is to help students understand mathematical concepts like Linear Algebra, Calculus, and Probability in the context of Artificial Intelligence.

Context:
The student is currently learning: ${context || "General AI Math"}

Instructions:
1. Answer the student's question clearly and concisely.
2. Use analogies related to programming or AI where possible.
3. If they ask for code, provide Python or Rust examples.
4. Keep the tone encouraging, "cyber-punk" aesthetic (optional but fun), and professional.
5. Do not just give the answer to exercises; guide them to the solution.

Student Question: ${message}
`;

        const result = await model.generateContent(systemPrompt);
        const response = await result.response;
        const text = response.text();

        return NextResponse.json({ response: text });
    } catch (error) {
        console.error("AI Tutor Error:", error);
        return NextResponse.json(
            { error: "Failed to verify query" },
            { status: 500 }
        );
    }
}
