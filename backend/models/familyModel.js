import mongoose from "mongoose";
import { Schema } from "mongoose";

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    qbmCode: String,
    desc: String,
    price: Object,
    tags: [String],
  },
  { _id: false }
);

const familySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    qbmCode: {
      type: String,
      required: true,
      unique: true,
    },
    desc: {
      type: String,
      required: true,
    },
    bannerLink: String,
    links: Object,
    observations: String,
    canvaLink: String,
    addInfoLink: String,
    products: [productSchema],
  },
  { timestamps: true }
);

// Criar índice textual no campo products.name
familySchema.index({ "products.name": "text" });

const Family = mongoose.model("Family", familySchema);

export default Family;
