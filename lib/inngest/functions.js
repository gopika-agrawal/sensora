// import { db } from "@/lib/prisma";
// import { inngest } from "./client";
// import { GoogleGenerativeAI } from "@google/generative-ai";

// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

// export const generateIndustryInsights = inngest.createFunction(
//   { id: "generate-industry-insights" },

//   { cron: "0 0 * * 0" },

//   async ({ step }) => {

//     const industries = await step.run(
//       "Fetch industries",
//       async () => {
//         return await db.industryInsight.findMany({
//           select: { industry: true },
//         });
//       }
//     );

//     for (const { industry } of industries) {

//       const prompt = `
// Analyze the current state of the ${industry} industry and provide insights in ONLY valid JSON format.

// {
//   "salaryRanges": [
//     {
//       "role": "string",
//       "min": number,
//       "max": number,
//       "median": number,
//       "location": "string"
//     }
//   ],
//   "growthRate": number,
//   "demandLevel": "High" | "Medium" | "Low",
//   "topSkills": ["skill1"],
//   "marketOutlook": "Positive" | "Neutral" | "Negative",
//   "keyTrends": ["trend1"],
//   "recommendedSkills": ["skill1"]
// }
// `;

//       const res = await model.generateContent(prompt);

//       const text = res.response.text();

//       const cleanedText = text
//         .replace(/```json/g, "")
//         .replace(/```/g, "")
//         .trim();

//       let insights;

//       try {
//         insights = JSON.parse(cleanedText);
//       } catch (error) {
//         console.error("Invalid JSON:", cleanedText);
//         continue;
//       }

//       await step.run(
//         `Update ${industry} insights`,
//         async () => {

//           await db.industryInsight.update({
//             where: { industry },

//             data: {
//               ...insights,
//               lastUpdated: new Date(),
//               nextUpdate: new Date(
//                 Date.now() + 7 * 24 * 60 * 60 * 1000
//               ),
//             },
//           });
//         }
//       );
//     }

//     return { success: true };
//   }
// );




import { db } from "@/lib/prisma";
import { inngest } from "./client";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
});

export const generateIndustryInsights = inngest.createFunction(
  {
    id: "generate-industry-insights",
    retries: 3,
  },

  {
    cron: "0 0 * * 0",
  },

  async ({ step }) => {

    // --------------------------------------------------
    // STEP 1: FETCH INDUSTRIES
    // --------------------------------------------------

    const industries = await step.run(
      "Fetch industries",
      async () => {

        return await db.industryInsight.findMany({
          select: {
            industry: true,
          },
        });

      }
    );


    // --------------------------------------------------
    // STEP 2: PROCESS EACH INDUSTRY
    // --------------------------------------------------

    for (const { industry } of industries) {

      // ------------------------------------------------
      // STEP 2A: GENERATE AI INSIGHTS
      // ------------------------------------------------

      const insights = await step.run(
        `Generate ${industry}`,
        async () => {

          const prompt = `
Analyze the current state of the ${industry} industry.

Return ONLY valid JSON.

{
  "salaryRanges": [
    {
      "role": "string",
      "min": 0,
      "max": 0,
      "median": 0,
      "location": "string"
    }
  ],
  "growthRate": 0,
  "demandLevel": "HIGH",
  "topSkills": ["skill1", "skill2"],
  "marketOutlook": "POSITIVE",
  "keyTrends": ["trend1", "trend2"],
  "recommendedSkills": ["skill1", "skill2"]
}

IMPORTANT:

demandLevel MUST be exactly:

"HIGH"
"MEDIUM"
"LOW"

marketOutlook MUST be exactly:

"POSITIVE"
"NEUTRAL"
"NEGATIVE"

Do not use lowercase values.

Do not use markdown.

Do not use code fences.

Return ONLY JSON.
`;

          const response = await model.generateContent(prompt);

          const text = response.response.text();

          const cleanedText = text
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();

          try {

            return JSON.parse(cleanedText);

          } catch (error) {

            console.error(
              `Invalid JSON generated for ${industry}:`,
              cleanedText
            );

            throw new Error(
              `Invalid JSON generated for ${industry}`
            );

          }

        }
      );


      // ------------------------------------------------
      // STEP 2B: NORMALIZE DATA
      // ------------------------------------------------

      const normalizedInsights = {

        salaryRanges: Array.isArray(insights.salaryRanges)
          ? insights.salaryRanges
          : [],

        growthRate: Number(insights.growthRate) || 0,

        demandLevel:
          String(insights.demandLevel).toUpperCase(),

        topSkills: Array.isArray(insights.topSkills)
          ? insights.topSkills.map(String)
          : [],

        marketOutlook:
          String(insights.marketOutlook).toUpperCase(),

        keyTrends: Array.isArray(insights.keyTrends)
          ? insights.keyTrends.map(String)
          : [],

        recommendedSkills:
          Array.isArray(insights.recommendedSkills)
            ? insights.recommendedSkills.map(String)
            : [],

      };


      // ------------------------------------------------
      // STEP 2C: UPDATE DATABASE
      // ------------------------------------------------

      await step.run(
        `Update ${industry} insights`,
        async () => {

          await db.industryInsight.update({

            where: {
              industry,
            },

            data: {

              salaryRanges: {
                set: normalizedInsights.salaryRanges,
              },

              growthRate:
                normalizedInsights.growthRate,

              demandLevel:
                normalizedInsights.demandLevel,

              topSkills: {
                set: normalizedInsights.topSkills,
              },

              marketOutlook:
                normalizedInsights.marketOutlook,

              keyTrends: {
                set: normalizedInsights.keyTrends,
              },

              recommendedSkills: {
                set: normalizedInsights.recommendedSkills,
              },

              lastUpdated: new Date(),

              nextUpdate: new Date(
                Date.now() +
                7 * 24 * 60 * 60 * 1000
              ),

            },

          });

        }
      );

    }

    return {
      success: true,
      processedIndustries: industries.length,
    };

  }
);