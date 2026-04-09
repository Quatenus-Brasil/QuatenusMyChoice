import mongoose from "mongoose";
import { Schema } from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new Schema({
  active: {
    type: Boolean,
    required: true,
    default: false,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  role: {
    type: String,
    default: "N/A",
  },
  sector: {
    type: String,
    required: true,
  },
  admin: {
    type: Boolean,
    required: true,
    default: false,
  },
  manager: {
    type: Boolean,
    required: true,
    default: false,
  },
});

userSchema.pre("save", async function () {
  this.password = await bcrypt.hash(this.password, 10);
});

const User = mongoose.model("User", userSchema);

export default User;
