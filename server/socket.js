// socket.js
const { Server } = require("socket.io");
const verifyToken = require("./utils/verifyToken");
const Family = require("./models/familyModel");

let io;

const initSockets = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.VITE_FRONTEND_URL, // Adjust this to match your React frontend URL in production
      methods: ["GET", "POST"],
    },
  });

  io.use(async (socket, next) => {
    const token = socket.handshake.auth.token;

    if (!token)
      socket.on("disconnect", () => {
        console.log("Client Disconnected!!");
      });

    socket.user = await verifyToken(token);

    next();
  });

  io.on("connection", (socket) => {
    console.log(`📡 New client connected to tracking stream: ${socket.id}`);
    console.log(`User connected: ${socket.user}`);

    // 👇 ADD THIS MASTER LOGGER HERE
    socket.onAny((eventName, ...args) => {
      console.log(`📥 Incoming Event: "${eventName}" | Data received:`, args);
    });

    // 1. When a user logs in on the frontend, have them join a room named after their Family ID
    socket.on("join_family_room", async (familyId) => {
      try {
        const family = await Family.findById(familyId);

        if (!family) return socket.emit("error", "Family not found!");

        const belongsToFamily = family.members.some(
          (m) => m.user.toString() === socket.user._id.toString(),
        );

        if (!belongsToFamily) {
          return socket.emit("error", "You are not a member of this family");
        }

        socket.join(familyId);

        console.log(`${socket.user.name} joined family room ${familyId}`);
      } catch (err) {
        console.error(err);
      }
    });

    // Handle incoming real-time coordinates from a moving device
    socket.on("send_live_location", async (data) => {
      console.log("Data received: ", data);
      let { userId, userName, familyId, coords } = data;

      try {
        io.to(familyId).emit("receive_live_location", {
          userId,
          userName,
          currentLocation: coords,
        });
        console.log(
          `📡 Broadcasted location for user ${userId} to room [${familyId}]`,
        );
      } catch (err) {
        console.error("Error broadcasting live location:", err.message);
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
