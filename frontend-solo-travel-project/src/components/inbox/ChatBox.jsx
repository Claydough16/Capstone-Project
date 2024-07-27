import React, { useEffect, useState } from "react";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import MessageCard from "./MessageCard";
import { Avatar, Box, Button, IconButton } from "@mui/material";
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  ConversationHeader,
} from "@chatscope/chat-ui-kit-react";
import { baseURL } from "../../environment";

function InboxDisplay({
  roomId,
  token,
  userName,
  currentDm,
  messages,
  userId,
  setMessages,
  fetchMessages,
  allMessages,
}) {
  async function sendMessage(userMessage) {
    const body = userMessage;
    const user = userName;
    const room = [userName, currentDm];

    let bodyObj = JSON.stringify({
      body,
      user,
      room,
    });

    const url = `${baseURL}/message/new`;
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("Authorization", token);

    const requestOption = {
      headers,
      body: bodyObj,
      method: "POST",
    };

    try {
      const response = await fetch(url, requestOption);
      const data = await response.json();
      fetchMessages();
    } catch (err) {
      console.error(err.message);
    }
  }

  const handleFriendRequest = async (friend) => {
    const url = `${baseURL}/user/friends`;

    const headers = new Headers();
    headers.append("Authorization", token);
    headers.append("Content-Type", "application/json");

    const body = { friendUserName: friend, userId: userId };

    const requestOptions = {
      headers,
      method: "POST",
      body: JSON.stringify(body),
    };

    console.log(body);

    try {
      const response = await fetch(url, requestOptions);

      if (!response.ok) {
        throw new Error("Failed to send friend request");
      }

      console.log("Friend request sent successfully.");
    } catch (error) {
      console.error("Error sending friend request:", error.message);
    }
  };


  let messageArray = [];

  allMessages.forEach((message) => {
    if (message.room.includes(currentDm)) {
      messageArray.push(message);
    }
  });


  return (
    <>
      <MainContainer
        responsive
        style={{
          height: "100%",
        }}
      >
        <ChatContainer>
          <ConversationHeader>
            <ConversationHeader.Content
              /*  info="Active 10 mins ago" */
              userName={currentDm}
            />
            <ConversationHeader.Actions>
              <IconButton
                onClick={() => {
                  handleFriendRequest(currentDm);
                }}
              >
                <PersonAddIcon />
              </IconButton>
            </ConversationHeader.Actions>
          </ConversationHeader>
          <MessageList
          /*   typingIndicator={<TypingIndicator content="Zoe is typing" />} */
          /*  <MessageSeparator content="Saturday, 30 November 2019" /> */
          >
            {messageArray
              ? messageArray.map((message) => (
                  <MessageCard
                    message={message}
                    userName={userName}
                  ></MessageCard>
                ))
              : null}
          </MessageList>
          <MessageInput
            placeholder="Type message here"
            onSend={sendMessage}
            attachButton={false}
          />
        </ChatContainer>
      </MainContainer>
    </>
  );
}

export default InboxDisplay;
