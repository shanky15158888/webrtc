import React, { useCallback, useEffect, useRef, useState } from "react";
import { useUserDetails } from "../providers/user";
import { useSocket } from "../providers/Socket";
import { useParams } from "react-router-dom";
import { usePeer } from "../providers/peer";
import ReactPlayer from "react-player";

const Roompage = () => {
  const { socket } = useSocket();
  const { getUserById, setUser } = useUserDetails();
  const { id } = useParams();
  const {
    peer,
    createOffer,
    createAnswer,
    setRemoteAnswer,
    sendStream,
    myStream,
    remoteStream,
    setMyStream,
  } = usePeer();

  const handleUserJoinedRoom = useCallback((data) => {
    console.log("User joined room", data.roomId);
  }, []);

  const handleNewUserJoined = useCallback(
    async (data) => {
      const { emailId } = data;
      setUser(id, { remoteEmailId: emailId });
      console.log("New user joined room", emailId);
      const offer = await createOffer();
      socket.emit("call-user", { emailId, offer });
    },
    [createOffer, socket]
  );

  const handlIncomingCall = useCallback(async (data) => {
    const { from, offer } = data;
    setUser(id, { remoteEmailId: from });
    console.log("incoming call from", from, offer);
    const answer = await createAnswer(offer);
    socket.emit("call-accepted", { emailId: from, answer });
  }, []);

  const handleCallAccepted = useCallback(
    async (data) => {
      const { answer } = data;
      console.log("Call got accepted", answer);
      await setRemoteAnswer(answer);
    },
    [setRemoteAnswer]
  );

  const getUserMediaStream = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
    return stream;
  }, []);

  const handleNegotiationNeeded = useCallback(async () => {
    const user = getUserById(id);
    console.log("Negotiation call");
    socket.emit("call-user", {
      emailId: user.remoteEmailId,
      offer: peer.localDescription,
    });
  }, [socket]);

  const handleSendStream = useCallback(async () => {
    sendStream(myStream);
  }, [myStream]);

  useEffect(() => {
    (async () => {
      setMyStream(await getUserMediaStream());
    })();
  }, []);

  useEffect(() => {
    const user = getUserById(id);
    socket.emit("join-room", { emailId: user.emailId, roomId: user.roomId });
    socket.on("joined-room", handleUserJoinedRoom);
    socket.on("user-joined", handleNewUserJoined);
    socket.on("incoming-call", handlIncomingCall);
    socket.on("call-accepted", handleCallAccepted);
    peer.addEventListener("negotiationneeded", handleNegotiationNeeded);
    return () => {
      socket.off("joined-room", handleUserJoinedRoom);
      socket.off("user-joined", handleNewUserJoined);
      socket.off("incoming-call", handlIncomingCall);
      socket.off("call-accepted", handleCallAccepted);
      peer.removeEventListener("negotiationneeded", handleNegotiationNeeded);
    };
  }, []);

  console.log({ myStream });

  return (
    <div>
      <button type="button" onClick={handleSendStream}>
        Send stream{" "}
      </button>
      <ReactPlayer url={myStream} playing muted controls />
      <ReactPlayer url={remoteStream} playing muted controls />
    </div>
  );
};

export default Roompage;
