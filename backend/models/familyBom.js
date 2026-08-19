import mongoose from "mongoose";
import { Schema } from "mongoose";

const accessoriesSchema = new Schema({
  amount: {
    type: Number,
    required: true,
  },
  accessory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Accessory",
    required: true,
  },
});

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

const familyBomSchema = new Schema(
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
    desc: {
      type: String,
      required: true,
    },
    observation: {
      type: String,
      default: null,
    },
    itens: {
      type: [itensSchema],
      required: true,
    },
    accessories: {
      type: [accessoriesSchema],
      default: [],
    },
    device: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Device",
    },
    activationGuide: {
      type: String,
      default: null,
    },
    altDevice: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Device",
      default: null,
    },
    altActivationGuide: {
      type: String,
      default: null,
    },
    chip: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chip",
      default: null,
    },
    riskFactor: {
      type: Number,
      default: 0,
      required: true,
    },
    a12: {
      type: Number,
      default: 0,
    },
    a24: {
      type: Number,
      default: 0,
    },
    a36: {
      type: Number,
      default: 0,
    },
    a48: {
      type: Number,
      default: 0,
    },
    a60: {
      type: Number,
      default: 0,
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
familyBomSchema.virtual("price").get(function () {
  const itensTotal = this.itens.reduce((total, itemEntry) => {
    if (itemEntry.item && itemEntry.item.price) {
      return total + itemEntry.amount * itemEntry.item.price;
    }
    return total;
  }, 0);

  const accessoriesTotal = this.accessories.reduce((total, accessoryEntry) => {
    if (accessoryEntry.item && accessoryEntry.item.price) {
      return total + accessoryEntry.amount * accessoryEntry.item.price;
    }
    return total;
  }, 0);

  const total = itensTotal + accessoriesTotal + this.device.price + (this.chip && this.chip.price != null ? this.chip.price : 0) + this.installationCost;
  return total;
});

const FamilyBom = mongoose.model("FamilyBom", familyBomSchema);

export default FamilyBom;
