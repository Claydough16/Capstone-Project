import React, { useState } from "react";
import {
  Conversation,
  ConversationList,
  Search,
  Sidebar,
} from "@chatscope/chat-ui-kit-react";
import { Box } from "@mui/material";

function RoomCard({
  room,
  userName,
  messages,
  setCurrent,
  fetchMessages,
  setMessages,
  currentDm,
  allMessages,
}) {
  let roomName = "";
  let newArray = [];
  let secondNewArray = [];
  const [lastMessage, setLast] = useState([]);

  //Logic to test which username to display
  if (room.addedUsers[1] === userName) {
    roomName = room.addedUsers[0];
  } else if (room.addedUsers[1] !== userName) {
    roomName = room.addedUsers[1];
  }

  //If room includes user, add message to list of room messages
  messages.forEach((message) => {
    if (message.room.includes(roomName)) {
      newArray.push(message);
    }
  });

  allMessages.forEach((message) => {
    if (message.room.includes(roomName)) {
      secondNewArray.push(message);
    }
  });
  let lastItem = secondNewArray.slice(-1)[0];

  /*   console.log(`${allMessages}`);
  console.log(`Room: ${roomName} Messages: ${secondNewArray}`); */

  function handleClick() {
    /*  setMessages([]); */
    setCurrent(roomName);
    /*  fetchMessages(); */

    /* let newArray = messages;
    let filteredArray = newArray.filter(checkRoom);
    setMessages(filteredArray);
    console.log(filteredArray); */
  }

  /* function checkRoom(message) {
    if (message.room.includes(roomName)) {
      return message;
    }
  } */
  //Here I experimented with sorting the messages chronologically.
  //This may be unnecesary as they are already stored as such in MongoDB
  //Keeping it here in case I'm wrong
  /*   newArray.sort(function (a, b) {
    // Turn your strings into dates, and then subtract them
    // to get a value that is either negative, positive, or zero.
    console.log(new Date(a.when));
    return new Date(b.when) - new Date(a.when);
  }); */
  const last = [newArray.slice(-1)[0]];

  return (
    <>
      <Conversation
        name={roomName}
        info={lastItem ? lastItem.body : null}
        lastSenderName={lastItem ? lastItem.user : null}
        /*  unreadDot */
        onClick={handleClick}
      />
    </>
  );
}

export default RoomCard;
