import React, { useState, useRef } from "react";
import axios from "axios";
import "./GPT.scss";

function GPT() {
  const [chatHistory, setChatHistory] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const handleInputChange = (event) => {
    setInput(event.target.value);
  };

  const scrollToBottom = () => {
    messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  };

  const handleInputSubmit = async (event) => {
    event.preventDefault();
    const inputText = input.trim();

    if (inputText.length === 0) {
      return;
    }

    const newChatEntry = { input: inputText, output: "", loading: true };
    setChatHistory((prevHistory) => [...prevHistory, newChatEntry]);
    setLoading(true);
    setInput("");

    try {
      const response = await axios.post(
        "https://api.openai.com/v1/completions",
        {
          prompt: inputText,
          model: "text-davinci-003",
          max_tokens: 4000,
          temperature: 1.0,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer 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",
          },
        }
      );
      const choices = response.data.choices;
      const text = choices.map((choice) => choice.text);
      newChatEntry.output = text;
      newChatEntry.loading = false;
      setChatHistory((prevHistory) => [...prevHistory, newChatEntry]);
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  const renderChatHistory = () => {
    return chatHistory.map((chatEntry, index) => (
      <div key={index}>
        <div className="chat-entry">
          <div className="chat-entry-bubble user-bubble">
            <div className="chat-entry-content">{chatEntry.input}</div>
          </div>
        </div>
        {chatEntry.loading ? (
          <div className="chat-entry">
            <div className="chat-entry-bubble bot-bubble">
              <div className="chat-entry-content loading">
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
              </div>
            </div>
          </div>
        ) : (
          chatEntry.output.map((output, outputIndex) => (
            <div key={outputIndex} className="chat-entry">
              <div className="chat-entry-bubble bot-bubble">
                <div className="chat-entry-content">{output}</div>
              </div>
            </div>
          ))
        )}
      </div>
    ));
  };

  return (
    <div className="chat-container">
      <h1 className="chat-title">GPT Chat</h1>
      <div className="chat-history">{renderChatHistory()}</div>
      <form onSubmit={handleInputSubmit}>
        <div className="chat-input-container">
          <input
            className="chat-input"
            type="text"
            placeholder="Type your message here"
            value={input}
            onChange={handleInputChange}
          />
          <button className="chat-send-button" type="submit">
            Send
          </button>
        </div>
      </form>
      <div ref={messagesEndRef} />
    </div>
    );
  }
  
  export default GPT;
