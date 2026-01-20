import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { students } = await req.json();

        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            // Mock response if no API Key
            return NextResponse.json({
                summary: "This is a simulated AI summary. The class is performing well overall, with high engagement in the 'Rust Fundamentals' track. Several students have achieved top scores, indicating a strong grasp of ownership concepts. (Add GEMINI_API_KEY to .env.local for real AI insights)",
                graphData: {
                    "A": 5, "B": 8, "C": 3, "D": 1, "F": 0
                }
            });
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `
      Analyze the following student data from a Rust programming course:
      ${JSON.stringify(students)}

      1. Provide a concise 2-3 sentence summary of the class performance.
      2. Provide a grade distribution (A, B, C, D, F) based on their scores (assume >90 is A, >80 B, etc.).
      
      Return ONLY a JSON object with this structure:
      {
        "summary": "string",
        "graphData": { "A": number, "B": number, "C": number, "D": number, "F": number }
      }
    `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        let text = response.text();

        // Cleanup markdown code blocks if present
        text = text.replace(/```json/g, "").replace(/```/g, "").trim();

        const data = JSON.parse(text);

        return NextResponse.json(data);
    } catch (error) {
        console.error("AI Summary Error:", error);
        return NextResponse.json(
            { error: "Failed to generate summary" },
            { status: 500 }
        );
    }
}
