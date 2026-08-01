const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },

    phoneNumber: {
      type: String,
      required: [true, "Please enter your mobile no!"],
      unique: true,
      match: [/^[0-9]{10}$/, "Please enter a valid 10-digit mobile number"],
    },
    password: {
      type: String,
      required: true,
      minlength: [6, "Password must have 6 chars!"],
      select: false,
      // unique: true,
    },
    confirmPassword: {
      type: String,
      required: true,
      validate: [
        function (val) {
          return val === this.password;
        },
        "confirmPassword should be equal to password!",
      ],
    },

    isOnline: {
      type: Boolean,
      default: false,
    },
    currentLocation: {
      type: { type: String, default: "Point" },
      coordinates: { type: [Number], default: [0, 0] },
    },
    locationUpdatedAt: { type: Date },
    deviceInfo: {
      type: String,
      default: "Unknown Device",
    },
    email: {
      type: String,
      required: [true, "Email is required for password recovery"],
      unique: true,
      lowercase: true,
    },
    resetPasswordOtp: {
      type: String,
      select: false, // Hides this from normal database queries for security
    },
    resetPasswordOtpExpiry: {
      type: Date,
      select: false,
    },
  },
  {
    timestamps: true,
  },
);

userSchema.index({ currentLocation: "2dsphere" });

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10);
  this.confirmPassword = undefined;

  // next();
});

// Instance Method: Compare input password with the hashed database password
userSchema.methods.correctPassword = async function (
  enteredPassword,
  userPassword,
) {
  return await bcrypt.compare(enteredPassword, userPassword);
};

const User = mongoose.model("User", userSchema);
module.exports = User;
