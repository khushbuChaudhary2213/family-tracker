const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = mongoose.Schema(
  {
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
      unique: true,
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
  },
  {
    timestamps: true,
  },
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10);
  this.confirmPassword = undefined;

  // next();
});

userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);
module.exports = User;
