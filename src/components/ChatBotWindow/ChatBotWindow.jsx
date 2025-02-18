import React, { useState, useEffect, useRef } from "react";
import { Button } from "antd";
import {
  CloseOutlined,
  RobotOutlined,
  UserOutlined,
  SendOutlined,
} from "@ant-design/icons";
import "./ChatBotWindow.css";
import CustomInput from "../CustomInput/CustomInput";

const ChatBotWindow = ({ onClose }) => {
  const API_URL = import.meta.env.VITE_API_URL;
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hey there 👋\nHow can I help you today?" },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef(null);

  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    if (!isLoading && inputRef.current) {
      inputRef.current.focus({ cursor: "end" });
    }
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });
      const data = await response.json();

      const botMessage = {
        sender: "bot",
        text: data.reply || "I am sorry, I could not generate a response.",
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

  return (
    <div className="chatbot-window-container">
      <div className="chatbot-header">
        <div className="chatbot-header-title">
          <RobotOutlined style={{ marginRight: 8 }} />
          Chatbot
        </div>
        <Button
          type="text"
          icon={<CloseOutlined style={{ fontSize: "16px", color: "#fff" }} />}
          onClick={onClose}
          className="chatbot-close-btn"
        />
      </div>

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

      <div className="chatbot-input-area">
        <CustomInput
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
