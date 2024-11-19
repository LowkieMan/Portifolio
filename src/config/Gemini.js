import { GoogleGenerativeAI } from "@google/generative-ai" 
import dotenv from "dotenv";
dotenv.config()

const apiKey = process.env.API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
    model: "gemini-1.5-pro",
  });
  
  const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
  };
  
  async function runChat() {
    const chatSession = model.startChat({
      generationConfig,
      history: [
      ],
    });
     
    const prompt = "hello"
    const result = await chatSession.sendMessage(prompt);
    console.log(result.response.text());

  }
  
runChat();
export default runChat;