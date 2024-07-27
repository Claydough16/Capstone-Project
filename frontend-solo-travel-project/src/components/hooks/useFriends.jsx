import React from "react";
import { baseURL } from "../../environment";
import { useState, useEffect } from "react";

function useFriends() {
  const [friends, setFriends] = useState([]);

  const addFriend = async (friendId) => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    const body = JSON.stringify({
      userId: userId,
      friendId: friendId,
    });

    const url = `${baseURL}/user/${userId}/friends`;
    const options = {
      method: "POST",
      body: body,
      headers: new Headers({
        Authorization: token,
        "Content-Type": "application/json",
      }),
    };

    const res = await fetch(url, options);
    const data = await res.json();
    console.log(data);
  };

  const deleteFriend = async (friendId) => {
    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");

      if (!token || !userId) {
        throw new Error("User not authenticated or user ID not found");
      }

      const body = JSON.stringify({
        userId: userId,
        friendId: friendId,
      });

      const url = `${baseURL}/user/friends`;
      const options = {
        method: "DELETE",
        body: body,
        headers: new Headers({
          Authorization: token,
          "Content-Type": "application/json",
        }),
      };

      const res = await fetch(url, options);
      if (!res.ok) {
        if (res.status === 404) {
          throw new Error("Endpoint not found or user/friend not found");
        } else {
          throw new Error("Failed to delete friend");
        }
      }

      const data = await res.json();
      console.log(data);

      setFriends((prevFriends) =>
        prevFriends.filter((friend) => friend.id !== friendId)
      );
      window.location.reload();
    } catch (error) {
      console.error("Error deleting friend:", error.message);
    }
  };

  const fetchFriends = async () => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    const url = `${baseURL}/user/${userId}/friends`;
    const options = {
      method: "GET",
      headers: new Headers({
        Authorization: token,
        "Content-Type": "application/json",
      }),
    };

    try {
      const res = await fetch(url, options);
      if (!res.ok) {
        throw new Error("Failed to fetch friends");
      }
      const data = await res.json();
      setFriends(data);
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    fetchFriends();
    console.log(friends);
  }, []);

  return { friends, fetchFriends, addFriend, deleteFriend };
}

export default useFriends;
