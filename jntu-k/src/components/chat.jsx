// Chat.jsx
import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import Header from "./header";
import { useRef } from "react";
import Footer from "./footer";
import "../App.css";
import { useLocation } from "react-router-dom";

// Create socket outside the component
const socket = io("http://localhost:3002");

const Chat = () => {
   const [chat, setChat] = useState([]);
  const [message, setMessage] = useState("");
  const mySocketId = useRef(null);
  const location = useLocation();
  const { name, email } = location.state || {};

  // Fetch old messages on component mount
  useEffect(() => {
    fetch("http://localhost:3002/messages")
      .then((res) => res.json())
      .then((data) =>
        setChat(
          data.map((msg) => ({
            sender: msg.sender_id === mySocketId.current ? "You" : name||"Stranger",
            message: msg.message,
          }))
        )
      );
  }, []);
 
  useEffect(() => {
   
    socket.on("connect", () => {
      mySocketId.current = socket.id;
    });

    
    socket.emit("new-user-joined", name);
 
    socket.on("chat-message", (data) => {
  if (data.senderId !== mySocketId.current) {
    setChat((prevChat) => [
      ...prevChat,
      { message: data.message, sender: data.senderName || "Stranger" },
    ]);
  }
});

 
    socket.on("user-joined", (joinedName) => {
      setChat((prevChat) => [
        ...prevChat,
        {
          message: `${joinedName || "A user"} joined the chat`,
          sender: "System",
        },
      ]);
    });

    socket.on("user-disconnected", (leftName) => {
      setChat((prevChat) => [
        ...prevChat,
        {
          message: `${leftName || "A user"} left the chat`,
          sender: "System",
        },
      ]);
    });

 
    return () => {
      socket.off("chat-message");
      socket.off("user-joined");
      socket.off("user-disconnected");
    };
  }, [name]);

 
  const sendMessage = (e) => {
    e.preventDefault();
    if (message.trim() === "") return;

    setChat((prev) => [...prev, { message, sender: "You" }]);

    socket.emit("chat-message", message);
    setMessage("");
  };
  return (
    <>
    <Header></Header>
<div className="chat-container">
  <h1 className="chat-title">Chat Room</h1>

  <div className="chat-box">
    {chat.map((entry, index) => (
      <p key={index} className={`chat-message ${entry.sender === "You" ? "sent" : "received"}`}>
        <strong>{entry.sender}:</strong> {entry.message}
      </p>
    ))}
  </div>

  <div className="chat-input-section">
    <input
      type="text"
      className="chat-input"
      value={message}
      onChange={(e) => setMessage(e.target.value)}
      onKeyDown={(e) => e.key === "Enter" && sendMessage()}
      placeholder="Type a message"
    />
    <button className="chat-send-btn" onClick={sendMessage}>Send</button>
  </div>
</div>
<Footer></Footer>
  </>);
};

export default Chat;