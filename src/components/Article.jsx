import React, { useState } from "react";
import { assets } from "../assets/assets";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Google Generative AI with API Key
const apiKey = import.meta.env.VITE_ACCESS_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

const Article = () => {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false); 

  const handleSend = async () => {
    if (!prompt.trim()) return;
    setLoading(true); 
    setResponse(""); 
    try {
      const chatSession = model.startChat({
        generationConfig,
        history: [],
      });
  
      const result = await chatSession.sendMessage(prompt);
  
      let fullResponse = result.response.text();
  
      fullResponse = fullResponse.replace(/\*\*(.*?)\*\*/g, "<br/><tt>$1</tt>");
  
      setResponse(fullResponse);
    } catch (error) {
      console.error("Error interacting with AI model:", error);
      setResponse("An error occurred. Please try again.");
    } finally {
      setLoading(false);
      setPrompt("");
    }
  };
  

  return (
    <div className="main-component">
      <div className="nav">
        <h1><span>AiCE</span></h1>
        <img src={assets.aice} alt="AiCE Logo" />
      </div>
      <hr />

      <div className="main-container">
        {loading ? "Generating response..." : <div dangerouslySetInnerHTML={{ __html: response }} />}
      </div>
      
      <div className="search-box">
        <textarea rows="1" type="text" 
          placeholder="Enter a prompt here"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        ></textarea>
        <img
          src={assets.send}
          alt="Send"
          style={{ cursor: "pointer" }}
          onClick={handleSend} // Trigger the AI interaction
        />
      </div>
    </div>
  );
};

export default Article;
