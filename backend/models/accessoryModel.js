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
    },
    numericCode: {
      type: String,
      required: true,
      unique: true,
    },
    desc: {
      type: String,
      required: true,
    },
    basePrice: {
      type: Number,
      required: true,
    },
    itens: [itensSchema],
    installationService: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Item",
      required: true,
    },
    banner: {
      type: String,
      default: null,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    createdByName: {
      type: String,
      required: true,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    updatedByName: {
      type: String,
      required: true,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } },
);

// Virtual field para calcular o preço total dinamicamente
accessorySchema.virtual("price").get(function () {
  if (!this.itens || this.itens.length === 0) {
    return this.basePrice;
  }

  const itensTotal = this.itens.reduce((total, itemEntry) => {
    if (itemEntry.item && itemEntry.item.price) {
      return total + itemEntry.amount * itemEntry.item.price;
    }
    return total;
  }, 0);
  const total = this.basePrice + itensTotal;
  return total;
});

const Accessory = mongoose.model("Accessory", accessorySchema);

export default Accessory;
