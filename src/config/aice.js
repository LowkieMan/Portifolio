// const apikey = "AIzaSyBqKsdul-CFQMJX1X49l0T_Q8we89d-FKA"
// Make sure to include these imports:
// import { GoogleGenerativeAI } from "@google/generative-ai";
export const API_KEY= "AIzaSyBqKsdul-CFQMJX1X49l0T_Q8we89d-FKA"

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(API_KEY);
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

async function runChat(prompt) {
  const chatSession = model.startChat({
    generationConfig,
    history: [
    ],
  });

  const result = await chatSession.sendMessage(prompt);
  console.log(result.response.text());
}

export default runChat;