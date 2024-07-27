import React, { useState } from "react";

import { Message } from "@chatscope/chat-ui-kit-react";

function MessageCard({ message, userName }) {
  let direction = "";
  if (message.user === userName) {
    direction = "outgoing";
  }
  if (message.user !== userName) {
    direction = "incoming";
  }
  const newMessage = message.body;
  const user = message.user;

  return (
    <>
      <Message
        model={{
          direction: direction,
          message: newMessage,
          position: "single",
          sender: user,
        }}
      ></Message>
    </>
  );
}

export default MessageCard;
