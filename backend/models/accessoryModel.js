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
      type: Number,
      required: true,
      unique: true,
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
      default: [],
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

// Virtual field para calcular o preço total dinamicamente
accessorySchema.virtual("price").get(function () {
  //soma: (amount * item.price) para cada item
  const itensTotal = this.itens.reduce((total, itemEntry) => {
    if (itemEntry.item && itemEntry.item.price) {
      return total + itemEntry.amount * itemEntry.item.price;
    }
    return total;
  }, 0);

  const total = itensTotal + this.installationCost;
  return total;
});

const Accessory = mongoose.model("Accessory", accessorySchema);

export default Accessory;
