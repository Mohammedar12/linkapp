"use client";
import { useEffect, useRef } from "react";
import { io } from "socket.io-client";

const SOCKET_URL =
  process.env.NEXT_PUBLIC_SOCKET_URL || "https://api.waslsa.com";

export const useSocket = (userId) => {
  const socket = useRef(null);

  useEffect(() => {
    // Initialize socket connection
    socket.current = io(SOCKET_URL, {
      withCredentials: true,
      reconnection: true,
      reconnectionAttempts: 5, // Limit reconnection attempts
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 10000,
      transports: ["websocket", "polling"], // Specify multiple transport methods
      auth: {
        userId: userId,
      },
    });

    // Connect and authenticate
    socket.current.on("connect", () => {
      console.log("Socket connected");

      // Authenticate with userId
      if (userId) {
        socket.current.emit("authenticate", userId);
      }
    });

    // Handle authentication confirmation
    socket.current.on("authenticated", (data) => {
      console.log("Socket authenticated:", data);
    });

    // Handle site updates
    socket.current.on("site:updated", (data) => {
      console.log("Site updated:", data);
      // Handle the update in your app
    });

    // Handle disconnection
    socket.current.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    // Cleanup on unmount
    return () => {
      if (socket.current) {
        socket.current.disconnect();
      }
    };
  }, [userId]);

  return socket.current;
};
