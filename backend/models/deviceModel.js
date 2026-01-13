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

const deviceSchema = new Schema(
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
    riskFactor: {
      type: Number,
      default: 1,
      required: true,
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
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// Virtual field para calcular o preço total dinamicamente
deviceSchema.virtual("price").get(function () {
  if (!this.itens || this.itens.length === 0) {
    return this.basePrice;
  }

  //soma: (amount * item.price) para cada item
  const itensTotal = this.itens.reduce((total, itemEntry) => {
    if (itemEntry.item && itemEntry.item.price) {
      return total + itemEntry.amount * itemEntry.item.price;
    }
    return total;
  }, 0);

  return this.basePrice + itensTotal;
});

const Device = mongoose.model("Device", deviceSchema);

export default Device;
