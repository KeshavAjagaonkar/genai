import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

//  Initialize Gemini with API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

//  Get the specific model instance
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

//  Create a reusable async function
export const generateGeminiResponse = async (userMessage) => {
  try {
    // send user input to the model and get result
    const result = await model.generateContent(userMessage);

    // extract and return the text output from Gemini response
    return result.response.text();
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to generate response from Gemini");
  }
};
