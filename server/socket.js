// socket.js
const { Server } = require("socket.io");
const verifyToken = require("./utils/verifyToken");
const Family = require("./models/familyModel");
const User = require("./models/userModel");
const { getAllowedViewerIds } = require("./utils/familyServices");

let io;

const initSockets = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.VITE_FRONTEND_URL, // Adjust this to match your React frontend URL in production
      methods: ["GET", "POST"],
    },
  });

  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;

      if (!token) return next(new Error("Authentication token missing"));

      socket.user = await verifyToken(token);

      next();
    } catch (err) {
      next(new Error("Authentication failed"));
    }
  });

  io.on("connection", (socket) => {
    const userId = socket.user._id.toString();
    console.log(`📡 New client connected to tracking stream: ${socket.id}`);
    console.log(`User connected: ${socket.user}`);

    // Every user joins a room keyed to their own id — this lets us target exactly the set of users permitted to see a given member's location, instead of broadcasting to the whole family room.
    socket.join(userId);

    // 👇 ADD THIS MASTER LOGGER HERE
    socket.onAny((eventName, ...args) => {
      console.log(`📥 Incoming Event: "${eventName}" | Data received:`, args);
    });

    socket.family = null;
    socket.lastKnownCoords = null;

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
        socket.familyId = familyId;

        await User.findByIdAndUpdate(userId, { isOnline: true });

        const allowedViewerIds = getAllowedViewerIds(family, userId);
        allowedViewerIds.forEach((viewerId) => {
          io.to(viewerId).emit("family_member_status", {
            userId,
            userName: socket.user.name,
            isOnline: true,
          });
        });

        console.log(`${socket.user.name} joined family room ${familyId}`);
      } catch (err) {
        console.error(err);
      }
    });

    // Handle incoming real-time coordinates from a moving device
    socket.on("send_live_location", async (data) => {
      try {
        console.log("Data received: ", data);
        const { familyId, coords } = data;

        const userId = socket.user.id.toString();
        const username = socket.user.name;

        if (!familyId || !coords || coords.lat == null || coords.lng == null) {
          return;
        }

        const family = await Family.findById(familyId).populate(
          "members.user",
          "_id",
        );

        if (!family) return socket.emit("error", "Family not found!");

        const isMember = family.members.some(
          (m) => m.user && m.user._id.toString() === userId,
        );

        if (!isMember) {
          return socket.emit("error", "You are not a member of this family");
        }

        socket.lastKnownCoords = coords;
        socket.familyId = familyId;

        const allowedViewerIds = getAllowedViewerIds(family, userId);
        allowedViewerIds.forEach((viewerId) => {
          io.to(viewerId).emit("receive_live_location", {
            userId,
            userName: socket.user.name,
            currentLocation: coords,
            isOnline: true,
          });
        });

        console.log(
          `📡 Broadcasted location for user ${userId} to room [${familyId}]`,
        );
      } catch (err) {
        console.error("Error broadcasting live location:", err.message);
      }
    });

    socket.on("disconnect", async () => {
      console.log(`❌ Client disconnected from tracking stream: ${socket.id}`);

      try {
        const updatedPayload = { isOnline: false };

        if (socket.lastKnownCoords) {
          updatedPayload.currentLocation = {
            type: "Point",
            coordinates: [
              Number(socket.lastKnownCoords.lng),
              Number(socket.lastKnownCoords.lat),
            ],
          };
          updatedPayload.locationUpdatedAt = new Date();
        }

        await User.findByIdAndUpdate(userId, { $set: updatedPayload });

        if (socket.familyId) {
          const family = await Family.findById(socket.familyId).populate(
            "members.user",
            "_id",
          );
          if (family) {
            const allowedViewerIds = getAllowedViewerIds(family, userId);
            allowedViewerIds.forEach((viewerId) => {
              io.to(viewerId).emit("family_member_status", {
                userId,
                userName: socket.user.name,
                isOnline: false,
                lastKnownLocation: socket.lastKnownCoords || null,
              });
            });
          }
        }
      } catch (err) {
        console.error(
          "Error persisting last known location on disconnect:",
          err.message,
        );
      }
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
