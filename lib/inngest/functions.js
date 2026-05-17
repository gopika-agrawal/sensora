import { db } from "@/lib/prisma";
import { inngest } from "./client";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

export const generateIndustryInsights = inngest.createFunction(
  { id: "generate-industry-insights" },

  { cron: "0 0 * * 0" },

  async ({ step }) => {

    const industries = await step.run(
      "Fetch industries",
      async () => {
        return await db.industryInsight.findMany({
          select: { industry: true },
        });
      }
    );

    for (const { industry } of industries) {

      const prompt = `
Analyze the current state of the ${industry} industry and provide insights in ONLY valid JSON format.

{
  "salaryRanges": [
    {
      "role": "string",
      "min": number,
      "max": number,
      "median": number,
      "location": "string"
    }
  ],
  "growthRate": number,
  "demandLevel": "High" | "Medium" | "Low",
  "topSkills": ["skill1"],
  "marketOutlook": "Positive" | "Neutral" | "Negative",
  "keyTrends": ["trend1"],
  "recommendedSkills": ["skill1"]
}
`;

      const res = await model.generateContent(prompt);

      const text = res.response.text();

      const cleanedText = text
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      let insights;

      try {
        insights = JSON.parse(cleanedText);
      } catch (error) {
        console.error("Invalid JSON:", cleanedText);
        continue;
      }

      await step.run(
        `Update ${industry} insights`,
        async () => {

          await db.industryInsight.update({
            where: { industry },

            data: {
              ...insights,
              lastUpdated: new Date(),
              nextUpdate: new Date(
                Date.now() + 7 * 24 * 60 * 60 * 1000
              ),
            },
          });
        }
      );
    }

    return { success: true };
  }
);