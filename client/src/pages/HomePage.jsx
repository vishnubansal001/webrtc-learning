import React, { useEffect, useState } from "react";
import { useSocket } from "../providers/Socket";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const { socket } = useSocket();
  const [email, setEmail] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const handleJoinedRoom = ({ roomId }) => {
    navigate(`/room/${roomId}`);
  };

  const navigate = useNavigate();

  useEffect(() => {
    socket.on("joined-room", handleJoinedRoom);
    return () => {
      socket.off("joined-room", handleJoinedRoom);
    };
  }, [socket]);
  const handleJoinRoom = () => {
    socket.emit("join-room", { roomId: roomCode, emailId: email });
  };
  return (
    <div className="homepage-container">
      <div className="input-container">
        <input
          type="email"
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
          }}
          name="email"
          id="email"
          placeholder="Enter Your Email Here"
        />
        <input
          type="text"
          name=""
          id=""
          value={roomCode}
          onChange={(event) => {
            setRoomCode(event.target.value);
          }}
          placeholder="Enter Room Code"
        />
        <button onClick={handleJoinRoom}>Join Room</button>
      </div>
    </div>
  );
};

export default HomePage;
