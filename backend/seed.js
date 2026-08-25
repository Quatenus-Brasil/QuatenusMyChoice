import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import User from "./models/userModel.js";
import readline from "node:readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const seedAdmin = async () => {
  try {
    console.info(`██████   ██    ██   █████   ████████  ████████  ███    ██  ██    ██  ███████ 
██    ██  ██    ██  ██   ██     ██     ██        ████   ██  ██    ██  ██      
██    ██  ██    ██  ███████     ██     █████     ██ ██  ██  ██    ██  ███████ 
██    ██  ██    ██  ██   ██     ██     ██        ██  ██ ██  ██    ██       ██ 
 ██████    ██████   ██   ██     ██     ████████  ██   ████   ██████   ███████ 
      ██                                                                      
\n`);

    await mongoose.connect(process.env.DB_URI);

    const adminExists = await User.findOne({ admin: true });

    if (adminExists) {
      console.log("Um usuário administrador já existe");
      process.exit(0);
    }

    console.log("=== Insira os detalhes do usuário administrador ===");
    const name = await new Promise((resolve) => rl.question("Digite o seu nome: ", resolve));
    const email = await new Promise((resolve) => rl.question("Digite o seu email: ", resolve));
    const password = await new Promise((resolve) => rl.question("Digite a sua senha: ", resolve));

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      active: true,
      name: name,
      email: email,
      password: hashedPassword,
      sector: "Desenvolvimento",
      admin: true,
      manager: false,
    });

    await newUser.save();

    console.log(`Usuário registrado com sucesso: ${email}`);

    process.exit(0);
  } catch (error) {
    console.error(`Erro durante a criação do usuário administrador: ${error.message}`);
    process.exit(1);
  }
};

seedAdmin();
