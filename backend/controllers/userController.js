import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import { request } from "express";

const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET_JWT, {
    expiresIn: process.env.SECRET_JWT_EXP,
  });
};

const register = async (request, response) => {
  try {
    const { active, name, email, password, role, sector, admin, manager } = request.body;

    if (typeof active !== "boolean" || !name || !email || !password || !sector || typeof admin !== "boolean" || typeof manager !== "boolean") {
      return response.status(400).json({ success: false, message: "Todos os campos são obrigatórios" });
    }

    const alreadyExists = await User.findOne({ email });
    if (alreadyExists) {
      return response.status(400).json({ success: false, message: "Este email já está em uso" });
    }

    const user = await User.create({ active, name, email, password, role, sector, admin, manager });

    const token = createToken(user._id);

    return response.status(201).json({ success: true, message: "Usuário registrado com sucesso", result: token });
  } catch (error) {
    console.log(error);
    return response.status(500).json({ success: false, message: error.message });
  }
};

const createUser = async (request, response) => {
  try {
    const { active, name, email, password, role, sector, admin, manager } = request.body;

    if (typeof active !== "boolean" || !name || !email || !password || !sector || typeof admin !== "boolean" || typeof manager !== "boolean") {
      return response.status(400).json({ success: false, message: "Todos os campos são obrigatórios" });
    }

    const alreadyExists = await User.findOne({ email });
    if (alreadyExists) {
      return response.status(400).json({ success: false, message: "Este email já está em uso" });
    }

    const user = await User.create({ active, name, email, password, role, sector, admin, manager });

    return response.status(201).json({ success: true, message: "Usuário registrado com sucesso", result: user });
  } catch (error) {
    console.log(error);
    return response.status(500).json({ success: false, message: error.message });
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

    return response.status(200).json({ success: true, message: "Usuário logado com sucesso", result: token });
  } catch (error) {
    console.log(error);
    return response.status(500).json({ message: error.message });
  }
};

const deleteUser = async (request, response) => {
  try {
    const { id } = request.params;

    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return response.status(404).json({ success: false, message: "Usuário não encontrado" });
    }

    return response.status(200).json({ success: true, message: "Usuário deletado com sucesso", result: user });
  } catch (error) {
    return response.status(500).json({ success: false, message: error.message });
  }
};

export { register, createUser, login, deleteUser };
