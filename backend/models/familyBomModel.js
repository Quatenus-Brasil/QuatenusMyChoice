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
    commitment12Months: {
      type: Number,
      default: 0,
    },
    commitment24Months: {
      type: Number,
      default: 0,
    },
    commitment36Months: {
      type: Number,
      default: 0,
    },
    commitment48Months: {
      type: Number,
      default: 0,
    },
    commitment60Months: {
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

familyBomSchema.virtual("price").get(function () {
  const itensTotal = this.itens.reduce((total, { amount, item }) => total + amount * item.price, 0);
  const accessoriesTotal = this.accessories.reduce((total, { amount, accessory }) => total + amount * accessory.price, 0);
  const chipPrice = this.chip ? this.chip.price : 0;

  return itensTotal + accessoriesTotal + this.device.price + chipPrice + this.installationCost;
});

const FamilyBom = mongoose.model("FamilyBom", familyBomSchema);

export default FamilyBom;
