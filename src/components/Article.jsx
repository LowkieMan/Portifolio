import React, { useState, useEffect, useRef } from "react";
import { assets } from "../assets/assets";
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_ACCESS_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

let chatSession = null;

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

const Article = () => {
  const [prompt, setPrompt] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const chatContainerRef = useRef(null);
  const textareaRef = useRef(null);
  const [greeting, setGreeting] = useState("Hello, developer!");

  useEffect(() => {
    chatSession = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
    }).startChat({
      generationConfig,
      history: [],
    });
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const handleTextareaInput = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;

      const maxHeight = 10 * 20;
      if (textareaRef.current.scrollHeight >= maxHeight) {
        textareaRef.current.style.height = `${maxHeight}px`;
      }
    }
  };

  const handleSend = async () => {
    if (!prompt.trim()) return;

    if (greeting) setGreeting("");

    const newChatEntry = { user: prompt, ai: null };
    setChatHistory((prev) => [...prev, newChatEntry]);
    setError("");
    setLoading(true);

    try {
      const result = await chatSession.sendMessage(prompt);
      const aiResponse = result.response?.text?.() || "No response received.";

      setChatHistory((prev) =>
        prev.map((entry, index) =>
          index === prev.length - 1 ? { ...entry, ai: aiResponse } : entry
        )
      );
    } catch (err) {
      console.error("API Error:", err);

      setChatHistory((prev) =>
        prev.map((entry, index) =>
          index === prev.length - 1
            ? { ...entry, ai: "An error occurred. Please try again." }
            : entry
        )
      );
      setError("An error occurred while communicating with the AI.");
    } finally {
      setLoading(false);
      setPrompt("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  };

  // Function to start a new chat
  const startNewChat = () => {
    // Reset chat history and greeting
    setChatHistory([]);
    setGreeting("Hello, developer!");
    // Reinitialize the chat session
    chatSession = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
    }).startChat({
      generationConfig,
      history: [],
    });
  };

  return (
    <div className="main-component">
      <div className="nav">
        <h1 onClick={startNewChat} style={{ cursor: "pointer" }}>
          <span>AiCE</span>
        </h1>
        <img src={assets.aice} alt="AiCE Logo" />
      </div>

      <div
        className="main-container"
        ref={chatContainerRef} 
        style={{
          overflowY: "auto",
          height: "400px",
        }}
      >
        {/* Display greeting message if no chat history exists */}
        {greeting && (
          <div className="greeting-message">
            <p> <span>{greeting}</span></p>
          </div>
        )}

        {!greeting && (
          <div className="chat-container">
            {chatHistory.map((entry, index) => (
              <div key={index} className="chat-entry">
                <p className="user-message">
                  <img src={assets.aice} alt="" />
                  {entry.user}
                </p>
                <div className="ai-response">
                  <img src={assets.code} alt="" />
                  {entry.ai && (
                    <p
                      className="ai-message"
                      dangerouslySetInnerHTML={{ __html: entry.ai }}
                    ></p>
                  )}
                </div>
              </div>
            ))}
            {loading && 
              <p className="loading-response">
                <hr />
                <hr />
                <hr />
              </p>}
            {error && <p className="error-message">{error}</p>}
          </div>
        )}
      </div>

      <div className="search-box">
        <textarea
          ref={textareaRef}
          rows="1"
          type="text"
          placeholder="Enter a prompt here"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onInput={handleTextareaInput}
          onKeyDown={handleKeyDown}
        ></textarea>
        <img
          src={assets.send}
          alt="Send"
          style={{ cursor: "pointer" }}
          onClick={handleSend}
        />
      </div>
    </div>
  );
};

export default Article;
