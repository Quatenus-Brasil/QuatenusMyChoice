import mongoose from "mongoose";

const validId = (request, response, next) => {
  const idParam = request.params.id;
  
  if (!idParam) {
    return response.status(400).json({ success: false, message: "ID é obrigatório" });
  }

  if (!mongoose.Types.ObjectId.isValid(idParam)) {
    return response.status(400).json({ success: false, message: "Mongo ID inválido" });
  }
  
  next();
};

export { validId };
