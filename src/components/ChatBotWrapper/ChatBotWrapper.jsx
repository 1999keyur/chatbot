import React, { useState } from "react";
import ChatBotWindow from "../ChatBotWindow/ChatBotWindow";
import { Button } from "antd";
import { MessageOutlined } from "@ant-design/icons";
import "./ChatBotWrapper.css";

const ChatBotWrapper = () => {
  const [visible, setVisible] = useState(false);
  const [minimized, setMinimized] = useState(false);

  const handleOpen = () => {
    setVisible(true);
    setMinimized(false);
  };

  const handleMinimize = () => {
    // Simply minimize (hide window) but keep chat history
    setMinimized(true);
    setVisible(false);
  };

  const handleEndChat = () => {
    // End chat clears history and closes the window
    setVisible(false);
    setMinimized(false);
  };

  return (
    <>
      {visible && (
        <ChatBotWindow onMinimize={handleMinimize} onEndChat={handleEndChat} />
      )}
      {/* Show open chat button if not visible and not minimized */}
      {!visible && !minimized && (
        <Button
          type="primary"
          shape="circle"
          icon={<MessageOutlined />}
          size="large"
          className="chatbot-open-button"
          onClick={handleOpen}
        />
      )}
      {/* If minimized, show a minimized chat icon */}
      {minimized && (
        <div className="chatbot-minimized" onClick={handleOpen}>
          <MessageOutlined style={{ fontSize: 24, color: "#fff" }} />
        </div>
      )}
    </>
  );
};

export default ChatBotWrapper;
