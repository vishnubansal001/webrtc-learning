import React, { useCallback, useEffect, useState } from "react";
import { useSocket } from "../providers/Socket";
import ReactPlayer from "react-player";
import { usePeer } from "../providers/Peer";

const Room = () => {
  const { socket } = useSocket();
  const {
    peer,
    createOffer,
    createAnswer,
    setRemoteAns,
    sendStream,
    remoteStream,
  } = usePeer();
  const [myStream, setMyStream] = useState(null);
  const [remoteEmail, setRemoteEmail] = useState("");

  const handleNewUserJoined = useCallback(
    async (data) => {
      const { emailId } = data;
      console.log("New User Joined", emailId);
      const offer = await createOffer();
      socket.emit("call-user", { emailId, offer });
      setRemoteEmail(emailId);
    },
    [createOffer, socket]
  );

  const handleIncomingCall = useCallback(
    async (data) => {
      const { offer, from } = data;
      console.log("Incoming Call", from, offer);
      const ans = await createAnswer(offer);
      socket.emit("call-accepted", { emailId: from, ans });
      setRemoteEmail(from);
    },
    [createAnswer, socket]
  );

  const handleCallAccepted = useCallback(
    async (data) => {
      const { ans } = data;
      console.log("Call Accepted", ans);
      await setRemoteAns(ans);
    },
    [setRemoteAns]
  );

  const getUserMediaStream = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    setMyStream(stream);
  }, []);

  useEffect(() => {
    socket.on("user-joined", handleNewUserJoined);
    socket.on("incoming-call", handleIncomingCall);
    socket.on("call-accepted", handleCallAccepted);

    return () => {
      socket.off("user-joined", handleNewUserJoined);
      socket.off("incoming-call", handleIncomingCall);
      socket.off("call-accepted", handleCallAccepted);
    };
  }, [handleIncomingCall, handleNewUserJoined, socket, handleCallAccepted]);

  const handleNegotiationNeededEvent = useCallback(async () => {
    const localOffer = peer.localDescription;
    socket.emit("call-user", { emailId: remoteEmail, offer: localOffer });
  }, [peer.localDescription, remoteEmail, socket]);

  useEffect(() => {
    peer.addEventListener("negotiationneeded", handleNegotiationNeededEvent);

    return () => {
      peer.removeEventListener(
        "negotiationneeded",
        handleNegotiationNeededEvent
      );
    };
  }, [handleNegotiationNeededEvent, peer]);

  useEffect(() => {
    getUserMediaStream();
  });

  return (
    <div className="room-page-container">
      <button onClick={(e) => sendStream(myStream)}>Send My Video</button>
      <ReactPlayer
        url={myStream}
        playing={true}
        controls={true}
        width="100%"
        height="100%"
      />
      <ReactPlayer
        url={remoteStream}
        playing={true}
        controls={true}
        width="100%"
        height="100%"
      />
    </div>
  );
};

export default Room;
