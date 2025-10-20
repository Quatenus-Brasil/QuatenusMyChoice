import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import mongoose from "mongoose";

const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET_JWT, {
    expiresIn: process.env.SECRET_JWT_EXP,
  });
};

const register = async (request, response) => {
  try {
    const { email, password, role } = request.body;

    if (!email || !password) {
      return response.status(400).json({ message: "Preencha todos os campos" });
    }

    const alreadyExists = await User.findOne({ email });
    if (alreadyExists) {
      return response.status(400).json({ message: "Este email já está em uso" });
    }

    const user = await User.create({ email, password, role });

    const token = createToken(user._id);

    return response.status(201).json(token);
  } catch (error) {
    console.log(error);
    return response.status(500).json({ message: error.message });
  }
};

const login = async (request, response) => {
  try {
    const { email, password } = request.body;

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return response.status(401).json({ message: "Credenciais inválidas" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return response.status(401).json({ message: "Credenciais inválidas" });
    }

    const token = createToken(user._id);

    return response.status(200).json(token);
  } catch (error) {
    console.log(error);
    return response.status(500).json({ message: error.message });
  }
};


export { register, login };
