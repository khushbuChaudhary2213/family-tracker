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

  io.on("connection", async (socket) => {
    const userId = socket.user._id.toString();

    await User.findByIdAndUpdate(userId, {
      isOnline: true,
    });
    console.log(`📡 New client connected to tracking stream: ${socket.id}`);
    console.log(`User connected: ${socket.user}`);

    // Every user joins a room keyed to their own id — this lets us target exactly the set of users permitted to see a given member's location, instead of broadcasting to the whole family room.
    socket.join(userId);

    // 👇 ADD THIS MASTER LOGGER HERE
    socket.onAny((eventName, ...args) => {
      console.log(`📥 Incoming Event: "${eventName}" | Data received:`, args);
    });

    // socket.family = null;
    socket.lastKnownCoords = null;

    const loadMyFamilies = async () => {
      const families = await Family.find({ "members.user": userId }).populate(
        "members.user",
        "_id",
      );
      socket.families = families;
      return families;
    };

    let myFamilies = [];
    try {
      myFamilies = await loadMyFamilies();
    } catch (err) {
      console.error("Failed to load families on connect:", err.message);
    }

    // Announce this user as online to every family they belong to, subject
    // to each family's own canViewLocationsOf permissions.
    myFamilies.forEach((family) => {
      const allowedViewerIds = getAllowedViewerIds(family, userId);
      allowedViewerIds.forEach((viewerId) => {
        io.to(viewerId).emit("family_member_status", {
          familyId: family._id.toString(),
          userId,
          userName: socket.user.name,
          isOnline: true,
        });
      });
    });

    //  Kept around for any future family-room-scoped feature (e.g. a family
    // chat). It no longer gates location broadcasting — a user can belong
    // to, and broadcast into, several families simultaneously.
    socket.on("join_family_room", async (familyId) => {
      try {
        // const family = await Family.findById(familyId);
        const family =
          socket.families?.find((f) => f._id.toString() === familyId) ||
          (await Family.findById(familyId));

        if (!family) return socket.emit("error", "Family not found!");

        const belongsToFamily = family.members.some(
          (m) => m.user.toString() === socket.user._id.toString(),
        );

        if (!belongsToFamily) {
          return socket.emit("error", "You are not a member of this family");
        }

        // if (socket.familyId && socket.familyId !== familyId) {
        //   socket.leave(socket.familyId);
        // }

        socket.join(familyId);
        // socket.familyId = familyId;

        // const allowedViewerIds = getAllowedViewerIds(family, userId);
        // allowedViewerIds.forEach((viewerId) => {
        //   io.to(viewerId).emit("family_member_status", {
        //     userId,
        //     userName: socket.user.name,
        //     isOnline: true,
        //   });
        // });

        console.log(`${socket.user.name} joined family room ${familyId}`);
      } catch (err) {
        console.error(err);
      }
    });

    // Real-time coords from a moving device. Fanned out to EVERY family the
    // sender belongs to, so members see the live position no matter which
    // family circle they currently have selected on their own screen.
    socket.on("send_live_location", async (data) => {
      try {
        console.log("Data received: ", data);
        // const { familyId, coords } = data;
        const { coords } = data || {};

        // const userId = socket.user.id.toString();
        // const username = socket.user.name;

        if (!coords || coords.lat == null || coords.lng == null) {
          return;
        }

        socket.lastKnownCoords = coords;

        const families = await loadMyFamilies();

        families.forEach((family) => {
          const allowedViewerIds = getAllowedViewerIds(family, userId);
          allowedViewerIds.forEach((viewerId) => {
            io.to(viewerId).emit("receive_live_location", {
              familyId: family._id.toString(),
              userId,
              userName: socket.user.name,
              currentLocation: coords,
              isOnline: true,
            });
          });

          console.log(
            `📡 Broadcasted location for user ${userId} to room [${family._id.toString()}]`,
          );
        });
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

        const families = socket.families?.length
          ? socket.families
          : await Family.find({ "members.user": userId });

        families.forEach((family) => {
          const allowedViewerIds = getAllowedViewerIds(family, userId);
          allowedViewerIds.forEach((viewerId) => {
            io.to(viewerId).emit("family_member_status", {
              familyId: family._id.toString(),
              userId,
              userName: socket.user.name,
              isOnline: false,
              lastKnownLocation: socket.lastKnownCoords || null,
            });
          });
        });
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
