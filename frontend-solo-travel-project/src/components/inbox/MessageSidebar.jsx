import {
  Conversation,
  ConversationList,
  Search,
  Sidebar,
} from "@chatscope/chat-ui-kit-react";
import { Avatar } from "@mui/material";
import MessageCard from "./MessageCard";
import React from "react";
import RoomCard from "./RoomCard";
function MessageSidebar({
  rooms,
  messages,
  userName,
  setCurrent,
  fetchMessages,
  setMessages,
  currentDm,
  allMessages,
}) {
  return (
    <>
      <Sidebar position="left">
        <Search placeholder="Search..." />
        <ConversationList>
          {rooms.map((room) => (
            <RoomCard
              room={room}
              messages={messages}
              userName={userName}
              setCurrent={setCurrent}
              fetchMessages={fetchMessages}
              setMessages={setMessages}
              currentDm={currentDm}
              allMessages={allMessages}
            />
          ))}
        </ConversationList>
      </Sidebar>
    </>
  );
}

export default MessageSidebar;

//To save time digging through documentation, here are two ways to do unreads

{
  /* <Conversation
  name="Emily"
  info="Yes i can do it for you"
  lastSenderName="Emily"
  unreadCnt={3}
  > 
      <Conversation
        name="Kai"
        info="Yes i can do it for you"
        lastSenderName="Kai"
        unreadDot
            >
  */
}
