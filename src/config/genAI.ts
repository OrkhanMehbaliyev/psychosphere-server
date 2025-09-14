import { GoogleGenAI } from "@google/genai";

let genAI = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
});

export default genAI;
