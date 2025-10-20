import "dotenv/config";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

const authenticateUser = async (request, response, next) => {
  try {
    const { authorization } = request.headers;

    if (!authorization) {
      return response.status(401).send({ message: "Sem permissão" });
    }

    const parts = authorization.split(" ");
    const [schema, token] = parts;

    if (parts.length !== 2) {
      return response.status(401).send({ message: "Sem permissão" });
    }

    if (schema !== "Bearer") {
      return response.status(401).send({ message: "Sem permissão" });
    }

    const decoded = jwt.verify(token, process.env.SECRET_JWT);
    const user = await User.findById(decoded._id);

    if (!user) {
      return response.status(404).json({ message: "Usuário não encontrado" });
    }

    request.userId = user._id.toString();
    request.email = user.email;
    request.role = user.role;
    request.admin = user.admin;
    request.manager = user.manager;

    next();
  } catch (error) {
    console.log(error);
    return response.status(500).send({ message: error.message });
  }
};

export { authenticateUser };
