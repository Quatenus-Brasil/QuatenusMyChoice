import mongoose from "mongoose";
import { Schema } from "mongoose";

const itensSchema = new Schema({
  amount: {
    type: Number,
    required: true,
  },
  unit: {
    type: String,
    required: true,
    enum: ["un", "cm", "m", "kit", "sv"],
  },
  item: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Item",
    required: true,
  },
});

const accessorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    code: {
      type: String,
      required: true,
      unique: true,
      match: /^\d+$/,
    },
    desc: {
      type: String,
      required: true,
    },
    banner: {
      type: String,
      default: null,
    },
    observation: {
      type: String,
      default: null,
    },
    itens: {
      type: [itensSchema],
      required: true,
    },
    installationCost: {
      type: Number,
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } },
);

accessorySchema.virtual("price").get(function () {
  const itensTotal = this.itens.reduce((total, { amount, item }) => total + amount * item.price, 0);
  return itensTotal + this.installationCost;
});

const Accessory = mongoose.model("Accessory", accessorySchema);

export default Accessory;
