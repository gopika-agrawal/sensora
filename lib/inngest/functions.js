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
    retries: 2,
  },

  {
    cron: "0 0 * * 0",
  },

  async ({ step }) => {

    // --------------------------------------------------
    // STEP 1: Fetch industries
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
    // STEP 2: Process every industry
    // --------------------------------------------------

    for (const { industry } of industries) {

      // ----------------------------------------------
      // STEP 2A: Generate AI insights
      // ----------------------------------------------

      const insights = await step.run(
        `Generate ${industry} insights`,
        async () => {

          const prompt = `
Analyze the current state of the ${industry} industry.

Return ONLY valid JSON.

Do NOT use markdown.
Do NOT use \`\`\`json.
Do NOT add explanations.

Return exactly this structure:

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
  "demandLevel": "High",
  "topSkills": [
    "skill1",
    "skill2"
  ],
  "marketOutlook": "Positive",
  "keyTrends": [
    "trend1",
    "trend2"
  ],
  "recommendedSkills": [
    "skill1",
    "skill2"
  ]
}

Rules:

- growthRate must be a number.
- min, max and median must be numbers.
- demandLevel must be exactly High, Medium or Low.
- marketOutlook must be exactly Positive, Neutral or Negative.
- salaryRanges must contain realistic roles.
- Return valid JSON only.
`;

          const res = await model.generateContent(prompt);

          const text = res.response.text();

          const cleanedText = text
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();

          try {

            return JSON.parse(cleanedText);

          } catch (error) {

            console.error(
              `Invalid Gemini JSON for ${industry}:`,
              cleanedText
            );

            throw new Error(
              `Gemini returned invalid JSON for ${industry}`
            );
          }

        }
      );


      // ----------------------------------------------
      // STEP 2B: Update database
      // ----------------------------------------------

      await step.run(
        `Update ${industry} insights`,
        async () => {

          await db.industryInsight.update({

            where: {
              industry,
            },

            data: {

              salaryRanges: insights.salaryRanges,

              growthRate: insights.growthRate,

              demandLevel: insights.demandLevel,

              topSkills: insights.topSkills,

              marketOutlook: insights.marketOutlook,

              keyTrends: insights.keyTrends,

              recommendedSkills: insights.recommendedSkills,

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


    // --------------------------------------------------
    // DONE
    // --------------------------------------------------

    return {
      success: true,
      processedIndustries: industries.length,
    };

  }
);