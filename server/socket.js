// socket.js
const { Server } = require("socket.io");

let io;

const initSockets = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*", // Adjust this to match your React frontend URL in production
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log(`📡 New client connected to tracking stream: ${socket.id}`);

    // 👇 ADD THIS MASTER LOGGER HERE
    socket.onAny((eventName, ...args) => {
      console.log(`📥 Incoming Event: "${eventName}" | Data received:`, args);
    });

    // 1. When a user logs in on the frontend, have them join a room named after their Family ID
    socket.on("join_family_room", (data) => {
      // If data is an object extract familyId, otherwise treat it as a string
      let familyId = typeof data === "object" ? data.familyId : data;

      if (familyId) {
        // Clean up any literal double or single quotes sent by client tools
        familyId = familyId.toString().replace(/['"]+/g, "");

        socket.join(familyId);
        console.log(
          `👥 Cleaned Room System: Client ${socket.id} joined room [${familyId}]`,
        );
      }
    });

    // 2. Handle incoming real-time coordinates from a moving device
    socket.on("send_live_location", async (data) => {
      let { userId, familyId, coordinates } = data;

      if (familyId) {
        // Clean up this string too just to be perfectly aligned!
        familyId = familyId.toString().replace(/['"]+/g, "");

        try {
          socket.to(familyId).emit("receive_live_location", {
            userId,
            currentLocation: {
              type: "Point",
              coordinates: coordinates,
            },
            locationUpdatedAt: new Date(),
          });
          console.log(
            `📡 Broadcasted location for user ${userId} to room [${familyId}]`,
          );
        } catch (err) {
          console.error("Error broadcasting live location:", err.message);
        }
      }
    });

    socket.on("disconnect", () => {
      console.log(`❌ Client disconnected from tracking stream: ${socket.id}`);
    });
  });

  return io;
};

const getIO = () => {
  if (!io) {
    throw new Error("Socket.io is not initialized!");
  }
  return io;
};

module.exports = { initSockets, getIO };
