import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import { sendWelcomeEmail } from "../services/emailService.js";

const createToken = (_id, rememberMe) => {
  return jwt.sign({ _id }, process.env.SECRET_JWT, {
    expiresIn: rememberMe ? "30d" : "3d",
  });
};

// TODO: Desativar depois e não enviar para produção
const register = async (request, response) => {
  try {
    const { active, name, email, password, sector, admin, manager } = request.body;

    if (typeof active !== "boolean" || !name || !email || !password || !sector || typeof admin !== "boolean" || typeof manager !== "boolean") {
      return response.status(400).json({ success: false, message: "Todos os campos são obrigatórios" });
    }

    const alreadyExists = await User.findOne({ email });
    if (alreadyExists) {
      return response.status(400).json({ success: false, message: "Este email já está em uso" });
    }

    const user = await User.create({ active, name, email, password, sector, admin, manager });

    const token = createToken(user._id);

    return response.status(201).json({ success: true, message: "Usuário registrado com sucesso", result: token });
  } catch (error) {
    console.log(error);
    return response.status(500).json({ success: false, message: error.message });
  }
};

const createUser = async (request, response) => {
  try {
    const { active, name, email, password, sector, admin, manager } = request.body;

    if (typeof active !== "boolean" || !name || !email || !password || !sector || typeof admin !== "boolean" || typeof manager !== "boolean") {
      return response.status(400).json({ success: false, message: "Todos os campos são obrigatórios" });
    }

    const alreadyExists = await User.findOne({ email });

    if (alreadyExists) {
      return response.status(400).json({ success: false, message: "Este email já está em uso" });
    }

    const user = await User.create({ active, name, email, password, sector, admin, manager });

    try {
      await sendWelcomeEmail(email, name, password);
    } catch (error) {
      console.error("Erro ao enviar email de boas-vindas:", error);
    }

    return response.status(201).json({ success: true, message: "Usuário registrado com sucesso", result: user });
  } catch (error) {
    console.log(error);
    return response.status(500).json({ success: false, message: error.message });
  }
};

const login = async (request, response) => {
  try {
    const { email, password, rememberMe } = request.body;

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return response.status(401).json({ success: false, message: "Credenciais inválidas" });
    }

    if (user.active === false) {
      return response.status(403).json({ success: false, message: "Usuário inativo. Fale com um gerente ou administrador." });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return response.status(401).json({ success: false, message: "Credenciais inválidas" });
    }

    const token = createToken(user._id, rememberMe);

    return response.status(200).json({ success: true, message: "Usuário logado com sucesso", result: token });
  } catch (error) {
    console.log(error);
    return response.status(500).json({ success: false, message: error.message });
  }
};

const findAllUsers = async (request, response) => {
  try {
    const allUsers = await User.find({});
    return response.status(200).json({ success: true, message: "Todos os usuários foram encontrados com sucesso", result: allUsers });
  } catch (error) {
    console.log(error);
    return response.status(500).json({ success: false, message: error.message });
  }
};

// const deleteUser = async (request, response) => {
//   try {
//     const { id } = request.params;

//     const user = await User.findByIdAndDelete(id);

//     if (!user) {
//       return response.status(404).json({ success: false, message: "Usuário não encontrado" });
//     }

//     return response.status(200).json({ success: true, message: "Usuário deletado com sucesso", result: user });
//   } catch (error) {
//     return response.status(500).json({ success: false, message: error.message });
//   }
// };

const inactivateUser = async (request, response) => {
  try {
    const { id } = request.params;
    console.log("ID: ", id);
    const user = await User.findByIdAndUpdate(id, { active: false }, { returnDocument: "after" });

    if (!user) {
      return response.status(404).json({ success: false, message: "Usuário não encontrado" });
    }

    return response.status(200).json({ success: true, message: "Usuário inativado com sucesso", result: user });
  } catch (error) {
    console.log(error);
    return response.status(500).json({ success: false, message: error.message });
  }
};


const findUserById = async (request, response) => {
  try {
    const { id } = request.params;

    const user = await User.findById(id);
    if (!user) {
      return response.status(404).json({ success: false, message: "Usuário não encontrado" });
    }

    return response.status(200).json({ success: true, message: "Usuário encontrado com sucesso", result: user });
  } catch (error) {
    console.log(error);
    return response.status(500).json({ success: false, message: error.message });
  }
};

const editUser = async (request, response) => {
  // TODO: Revisar essa função:
  // 1. Eu não sei dizer se isso aqui é a forma correta de atualizar o usuário.
  // Essa rota é para o admin/manager atualizar qualquer usuário, então o ID vai no corpo ou no params?
  // 2. Isso ta sendo feito via PUT, eu preciso mesmo colocar TUDO no corpo do usuário? Não posso só passar o que veio?
  // Talvez eu possa fazer igual a edição de item, onde eu pego o que veio e atualizo só o que veio.
  try {
    const { id, active, name, email, password, sector, admin, manager } = request.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return response.status(400).json({ success: false, message: "ID de usuário inválido" });
    }

    if (typeof active !== "boolean" || !name || !email || !sector || typeof admin !== "boolean" || typeof manager !== "boolean") {
      return response.status(400).json({ success: false, message: "Todos os campos são obrigatórios" });
    }

    const alreadyExists = await User.findOne({ email });

    if (alreadyExists && alreadyExists._id.toString() !== id) {
      return response.status(400).json({ success: false, message: "Este email já está em uso por outro usuário" });
    }

    const updatedUser = { active, name, email, sector, admin, manager };

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updatedUser.password = hashedPassword;
    }

    const user = await User.findByIdAndUpdate(id, updatedUser, { new: true });

    return response.status(200).json({ success: true, message: "Usuário atualizado com sucesso", result: user });
  } catch (error) {
    console.log(error);
    return response.status(500).json({ success: false, message: error.message });
  }
};

const changePassword = async (request, response) => {
  try {
    const id = request.user._id;
    const { newPassword } = request.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return response.status(400).json({ success: false, message: "ID de usuário inválido" });
    }

    if (!newPassword) {
      return response.status(400).json({ success: false, message: "A nova senha é obrigatória" });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.findByIdAndUpdate(id, { password: hashedPassword });

    return response.status(200).json({ success: true, message: "Senha alterada com sucesso" });
  } catch (error) {
    console.log(error);
    return response.status(500).json({ success: false, message: error.message });
  }
};

export { register, createUser, login, findAllUsers, inactivateUser, findUserById, editUser, changePassword };
