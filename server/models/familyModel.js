const mongoose = require("mongoose");

const familySchema = new mongoose.Schema(
  {
    familyName: {
      type: String,
      required: true,
    },

    inviteCode: {
      type: String,
      unique: true,
    },

    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    members: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },

        role: {
          type: String,
          enum: ["admin", "member"],
          default: "member",
        },
        canViewLocationsOf: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
          },
        ],
      },
    ],
  },
  {
    timestamps: true,
  },
);

const Family = mongoose.model("Family", familySchema);

module.exports = Family;
