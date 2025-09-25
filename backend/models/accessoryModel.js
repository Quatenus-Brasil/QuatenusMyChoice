import mongoose from "mongoose";
import { Schema } from "mongoose";

const accessoriesSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
  },
  desc: {
    type: String,
    required: true,
  },
});

const Accessory = mongoose.model("Accessory", accessoriesSchema);

export default Accessory;
