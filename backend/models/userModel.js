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
  sector: {
    type: String,
    required: true,
    enum: [
      "Direção",
      "Marketing",
      "Vendas",
      "Recursos Humanos",
      "Compras",
      "Suporte & Operações",
      "Logística",
      "Infraestrutura",
      "Qualidade",
      "Financeiro",
      "Customer Success",
      "Parcerias e Inovação",
      "Desenvolvimento"
    ],
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
  tokenVersion: {
    type: Number,
    required: true,
    default: 0,
  },
});

userSchema.pre("save", async function () {
  this.password = await bcrypt.hash(this.password, 10);
});

const User = mongoose.model("User", userSchema);

export default User;
