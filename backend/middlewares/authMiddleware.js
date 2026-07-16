import "dotenv/config";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

const authenticateUser = async (request, response, next) => {
  try {
    const { authorization } = request.headers;

    if (!authorization) {
      return response.status(401).json({ success: false, message: "Sem permissão" });
    }

    const parts = authorization.split(" ");
    const [schema, token] = parts;

    if (parts.length !== 2) {
      return response.status(401).json({ success: false, message: "Sem permissão" });
    }

    if (schema !== "Bearer") {
      return response.status(401).json({ success: false, message: "Sem permissão" });
    }

    const decoded = jwt.verify(token, process.env.SECRET_JWT);
    const user = await User.findById(decoded._id);

    if (!user) {
      return response.status(404).json({ success: false, message: "Usuário não encontrado" });
    }

    const tokenVersion = Number(decoded.tokenVersion ?? 0);
    const userTokenVersion = Number(user.tokenVersion ?? 0);

    if (tokenVersion !== userTokenVersion) {
      return response.status(401).json({ success: false, message: "Token inválido ou sessão expirada" });
    }

    request.user = {
      _id: user._id.toString(),
      active: user.active,
      name: user.name,
      email: user.email,
      sector: user.sector,
      admin: user.admin,
      manager: user.manager,
    };

    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return response.status(401).json({
        success: false,
        message: "Token expirado",
      });
    }

    if (error instanceof jwt.JsonWebTokenError) {
      return response.status(401).json({
        success: false,
        message: "Token inválido",
      });
    }

    console.log(error);
    return response.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const isAdmin = (request, response, next) => {
  if (request.user.admin === false) {
    return response.status(403).json({
      success: false,
      message: "Sem Permissão: Você precisa ser um administrador",
    });
  }
  next();
};

const isManager = (request, response, next) => {
  if (request.user.manager === false && request.user.admin === false) {
    return response.status(403).json({
      success: false,
      message: "Sem Permissão: Você precisa ser um gerente ou administrador",
    });
  }
  next();
};

const authorizedSectors = (...allowedSectors) => {
  return (request, response, next) => {
    if (!allowedSectors.includes(request.user.sector) && request.user.admin === false) {
      return response.status(403).json({
        success: false,
        message: "Sem Permissão: Você não pertence a um setor autorizado",
      });
    }
    next();
  };
  // 01 Direção
  // 02 Marketing
  // 03 Vendas
  // 04 Recursos Humanos
  // 05 Compras
  // 06 Suporte & Operações
  // 07 Logística
  // 08 Infraestrutura
  // 09 Qualidade
  // 10 Financeiro
  // 11 Customer Success
  // 12 Parcerias e Inovação
};

export { authenticateUser, isAdmin, isManager, authorizedSectors };
