import { useEffect, useState } from "react";
import { io } from "socket.io-client";

export function useSocketQueue(initialSnapshot = null) {
  const [snapshot, setSnapshot] = useState(initialSnapshot);

  useEffect(() => {
    const socket = io(import.meta.env.VITE_SOCKET_URL || "http://localhost:5000", {
      transports: ["websocket"]
    });
    socket.emit("queue:join");
    socket.on("queue:update", setSnapshot);
    return () => socket.disconnect();
  }, []);

  return [snapshot, setSnapshot];
}
