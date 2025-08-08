import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../context/context";

const ChatWrapper = () => {
  const { user } = useContext(UserContext);
  const [chats, setChats] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token || !user) return;

    axios
      .get("import.meta.env.VITE_API_URL/api/chat", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setChats(res.data))
      .catch((err) => console.error("Error fetching chats", err));
  }, [user]);

  return (
    <div className="max-w-3xl mx-auto p-6 mt-10 bg-white shadow rounded">
      <h1 className="text-2xl font-bold mb-4">Your Conversations</h1>
      {chats.length === 0 ? (
        <p className="text-gray-500">No chats yet.</p>
      ) : (
        chats.map((chat) => {
          const other = chat.members.find((m) => m._id !== user._id);
          return (
            <Link
              to={`/chat/${chat._id}`}
              key={chat._id}
              className="block border-b py-3 hover:bg-gray-100"
            >
              <p className="font-semibold">{other?.username}</p>
              <p className="text-sm text-gray-500">{chat.lastMessage || "No messages yet."}</p>
            </Link>
          );
        })
      )}
    </div>
  );
};

export default ChatWrapper;
