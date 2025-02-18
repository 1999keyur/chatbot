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
    setMinimized(true);
    setVisible(false);
  };

  const handleEndChat = () => {
    setVisible(false);
    setMinimized(false);
  };

  return (
    <>
      {visible && (
        <ChatBotWindow onMinimize={handleMinimize} onEndChat={handleEndChat} />
      )}
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
      {minimized && (
        <div className="chatbot-minimized" onClick={handleOpen}>
          <MessageOutlined style={{ fontSize: 24, color: "#fff" }} />
        </div>
      )}
    </>
  );
};

export default ChatBotWrapper;
