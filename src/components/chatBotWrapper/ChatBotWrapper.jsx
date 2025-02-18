import React, { useState } from "react";
import { Button } from "antd";
import { MessageOutlined } from "@ant-design/icons";
import ChatBotWindow from "../ChatBotWindow/ChatBotWindow";
import "./ChatBotWrapper.css";

const ChatBotWrapper = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  return (
    <>
      {isOpen ? (
        <ChatBotWindow onClose={handleClose} />
      ) : (
        <Button
          type="primary"
          shape="circle"
          icon={<MessageOutlined />}
          size="large"
          className="chatbot-open-button"
          onClick={handleOpen}
        />
      )}
    </>
  );
};

export default ChatBotWrapper;
