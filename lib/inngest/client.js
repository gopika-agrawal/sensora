import { Inngest } from "inngest";

export const inngest = new Inngest({ 
    id: "sensora", 
    name: "Sensora",
    credentials: {
        gemini: {
            apiKey: process.env.GEMINI_API_KEY,
        },
    },
});