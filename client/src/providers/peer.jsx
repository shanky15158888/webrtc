import React, { useCallback, useEffect, useMemo, useState } from "react";

const PeerContext = React.createContext(null);

export const usePeer = () => React.useContext(PeerContext);

export const PeerProvider = (props) => {
  const [myStream, setMyStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);

  const peer = useMemo(() => new RTCPeerConnection(), []);

  const createOffer = useCallback(async () => {
    const offer = await peer.createOffer();
    await peer.setLocalDescription(offer);
    return offer;
  }, [peer]);

  const createAnswer = useCallback(
    async (offer) => {
      await peer.setRemoteDescription(offer);
      const answer = await peer.createAnswer();
      await peer.setLocalDescription(answer);
      return answer;
    },
    [peer]
  );

  const setRemoteAnswer = useCallback(
    async (answer) => {
      // if (peer.signalingState === "stable") return;
      await peer.setRemoteDescription(answer);
    },
    [peer]
  );

  const sendStream = useCallback(
    (stream) => {
      const tracks = stream.getTracks();
      for (const track of tracks) {
        peer.addTrack(track, stream);
      }
    },
    [peer]
  );

  const value = useMemo(
    () => ({
      peer,
      createOffer,
      createAnswer,
      setRemoteAnswer,
      sendStream,
      myStream,
      remoteStream,
      setMyStream,
    }),
    [
      peer,
      createOffer,
      createAnswer,
      setRemoteAnswer,
      myStream,
      remoteStream,
      sendStream,
      setMyStream,
    ]
  );

  const handleTrackEvent = useCallback((event) => {
    const streams = event.streams;
    setRemoteStream(streams[0]);
  }, []);

  useEffect(() => {
    peer.addEventListener("track", handleTrackEvent);
    return () => {
      peer.removeEventListener("track", handleTrackEvent);
    };
  }, [peer]);

  return (
    <PeerContext.Provider value={value}>{props.children}</PeerContext.Provider>
  );
};
