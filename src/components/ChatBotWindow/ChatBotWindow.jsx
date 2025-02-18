import React, { useState, useEffect, useRef } from "react";
import { Button, Input } from "antd";
import {
  DownOutlined,
  RobotOutlined,
  UserOutlined,
  SendOutlined,
} from "@ant-design/icons";
import "./ChatBotWindow.css";

const ChatBotWindow = ({ onMinimize, onEndChat }) => {
  // Load initial messages from localStorage if available
  const storedMessages = localStorage.getItem("chatMessages");
  const initialMessages = storedMessages
    ? JSON.parse(storedMessages)
    : [{ sender: "bot", text: "Hey there 👋\nHow can I help you today?" }];

  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll and store messages to localStorage on update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    localStorage.setItem("chatMessages", JSON.stringify(messages));
  }, [messages]);

  // Always focus input after message update
  useEffect(() => {
    inputRef.current?.focus();
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await fetch(import.meta.env.VITE_API_URL, {
        // Update endpoint if needed
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });
      const data = await response.json();
      const botMessage = {
        sender: "bot",
        text: data.reply || "I could not generate a response.",
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Oops! An error occurred." },
      ]);
    } finally {
      setIsLoading(false);
      setInput("");
      inputRef.current?.focus();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSend();
  };

  // End Chat: clear localStorage and reset chat history
  const handleEndChat = () => {
    localStorage.removeItem("chatMessages");
    setMessages([
      { sender: "bot", text: "Hey there 👋\nHow can I help you today?" },
    ]);
    if (onEndChat) onEndChat();
  };

  return (
    <div className="chatbot-window-container">
      {/* Header with Minimize and End Chat buttons */}
      <div className="chatbot-header">
        <div className="chatbot-header-title">
          <RobotOutlined style={{ marginRight: 8 }} />
          Chatbot
        </div>
        <div className="chatbot-header-buttons">
          <Button
            type="text"
            onClick={handleEndChat}
            style={{ color: "#fff", marginLeft: 8 }}
          >
            End Chat
          </Button>
          <Button
            type="text"
            icon={<DownOutlined style={{ fontSize: "16px", color: "#fff" }} />}
            onClick={onMinimize}
          />
        </div>
      </div>

      {/* Chat Messages Area */}
      <div className="chatbot-messages-area">
        {messages.map((msg, idx) => {
          const isBot = msg.sender === "bot";
          return (
            <div
              key={idx}
              className={`chat-message-wrapper ${isBot ? "bot" : "user"}`}
            >
              <div className="chat-icon">
                {isBot ? (
                  <RobotOutlined style={{ color: "#fff" }} />
                ) : (
                  <UserOutlined style={{ color: "#fff" }} />
                )}
              </div>
              <div className="chat-bubble">
                {msg.text.split("\n").map((line, i) => (
                  <p key={i} className="chat-bubble-text">
                    {line}
                  </p>
                ))}
              </div>
            </div>
          );
        })}
        {isLoading && (
          <div className="chat-message-wrapper bot">
            <div className="chat-icon">
              <RobotOutlined style={{ color: "#fff" }} />
            </div>
            <div className="chat-bubble">
              <p className="chat-bubble-text">Thinking...</p>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="chatbot-input-area">
        <Input
          ref={inputRef}
          placeholder="Message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={isLoading}
          className="chat-input"
        />
        <Button
          type="primary"
          icon={<SendOutlined />}
          onClick={handleSend}
          disabled={isLoading}
        />
      </div>
    </div>
  );
};

export default ChatBotWindow;
