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

// Function to format AI response with HTML
const formatResponseWithHTML = (response) => {
  // Escape raw HTML special characters early
  response = response.replace(/</g, "&lt;").replace(/>/g, "&gt;");

  // Replace code blocks (```)
  response = response.replace(/```([a-z]*)\n([\s\S]*?)```/g, '<pre><code class="$1">$2</code></pre>');

  // Replace inline code (` `)
  response = response.replace(/`([^`]+)`/g, "<code>$1</code>");

  // Replace blockquotes (>)
  response = response.replace(/^> (.*?)(?=\n|$)/gm, "<blockquote>$1</blockquote>");

  // Replace headers (h1-h6)
  response = response.replace(/^###### (.*?)$/gm, "<h6>$1</h6>");
  response = response.replace(/^##### (.*?)$/gm, "<h5>$1</h5>");
  response = response.replace(/^#### (.*?)$/gm, "<h4>$1</h4>");
  response = response.replace(/^### (.*?)$/gm, "<h3>$1</h3>");
  response = response.replace(/^## (.*?)$/gm, "<h2>$1</h2>");
  response = response.replace(/^# (.*?)$/gm, "<h1>$1</h1>");

  // Replace horizontal rules (---)
  response = response.replace(/^---$/gm, "<hr>");

  // Replace unordered list items (- or *)
  response = response.replace(/^[\*\-] (.*?)(?=\n|$)/gm, "<li>$1</li>");
  response = response.replace(/(<li>.*<\/li>)/g, "<ul>$1</ul>");

  // Replace ordered list items (1., 2., ...) with incremental numbering
  let orderedListCount = 0; // Counter for ordered list items
  response = response.replace(/^\d+\.\s(.*?)(?=\n|$)/gm, (match, content) => {
    orderedListCount++; // Increment the ordered list count
    return `<li>${content}</li>`;
  });

  // Wrap all the <li> items with <ol> or <ul> based on the context
  response = response.replace(/(<li>.*<\/li>)/g, (match) => {
    if (match.indexOf("<ol>") === -1 && match.indexOf("<ul>") === -1) {
      return "<ul>" + match + "</ul>"; // If it's an unordered list item, wrap in <ul>
    }
    return match; // For ordered list items, don't change
  });

  // Replace bold text (** or __)
  response = response.replace(/\*\*(.*?)\*\*/g, "<b>$1</b>");
  response = response.replace(/__(.*?)__/g, "<b>$1</b>");

  // Replace italic text (* or _)
  response = response.replace(/\*(.*?)\*/g, "<i>$1</i>");
  response = response.replace(/_(.*?)_/g, "<i>$1</i>");

  // Replace strikethrough text (~~)
  response = response.replace(/~~(.*?)~~/g, "<s>$1</s>");

  // Replace links ([text](url))
  response = response.replace(
    /\[([^\]]+)\]\((https?:\/\/[^\s]+)\)/g,
    '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>'
  );

  // Replace paragraphs
  response = response.replace(/(?:\n|^)([^\n<][^<]*)(?=\n|$)/g, "<p>$1</p>");

  return response;
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

      // Format the response with HTML
      const formattedResponse = formatResponseWithHTML(aiResponse);

      setChatHistory((prev) =>
        prev.map((entry, index) =>
          index === prev.length - 1
            ? { ...entry, ai: formattedResponse }
            : entry
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

  const startNewChat = () => {
    setChatHistory([]);
    setGreeting("Hello, developer!");
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

      <div className="main-container"
        ref={chatContainerRef}
        style={{
          overflowY: "auto",
          height: "400px",
        }}
      >
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
