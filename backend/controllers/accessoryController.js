import Accessory from "../models/accessoryModel.js";
import mongoose from "mongoose";
import fs from "fs";

const cleanupFiles = (files) => {
  if (!files) return;
  for (const fieldFiles of Object.values(files)) {
    for (const file of fieldFiles) {
      if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
    }
  }
};

const parseJsonField = (value) => {
  if (typeof value === "string") {
    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  }
  return value;
};

const createAccessory = async (request, response) => {
  try {
    const newAccessory = {
      name: request.body.name,
      code: request.body.code,
      numericCode: request.body.numericCode,
      desc: request.body.desc,
      basePrice: request.body.basePrice,
      itens: parseJsonField(request.body.itens),
      installationService: request.body.installationService,
      createdBy: request.user._id,
      createdByName: request.user.name,
      updatedBy: request.user._id,
      updatedByName: request.user.name,
    };

    if (request.files?.banner?.[0]) {
      newAccessory.banner = request.files.banner[0].path;
    }

    const accessory = await Accessory.create(newAccessory);

    await accessory.populate("itens.item installationService");

    return response.status(201).json({ success: true, message: "Acessório criado com sucesso", result: accessory });
  } catch (error) {
    cleanupFiles(request.files);
    console.log(error);
    return response.status(500).json({ success: false, message: error.message });
  }
};

const findAllAccessories = async (request, response) => {
  try {
    // TODO: Lembrar de desativar o populate do findAll quando for fazer o front
    const allAccessories = await Accessory.find({}).populate("itens.item installationService");

    return response.status(200).json({ success: true, message: "Todos os acessórios foram encontrados com sucesso", result: allAccessories });
  } catch (error) {
    console.log(error);
    return response.status(500).json({ success: false, message: error.message });
  }
};

const findAccessoryById = async (request, response) => {
  try {
    const { id } = request.params;

    const accessory = await Accessory.findById(id).populate("itens.item installationService");

    if (!accessory) {
      return response.status(404).json({ success: false, message: "Nenhum acessório encontrado" });
    }

    return response.status(200).json({ success: true, message: "Acessório encontrado com sucesso", result: accessory });
  } catch (error) {
    console.log(error);
    return response.status(500).json({ success: false, message: error.message });
  }
};

const deleteAccessory = async (request, response) => {
  try {
    const { id } = request.params;
    const accessory = await Accessory.findByIdAndDelete(id);

    if (!accessory) {
      return response.status(404).json({ success: false, message: "Acessório não encontrado" });
    }

    if (accessory.banner && fs.existsSync(accessory.banner)) {
      fs.unlinkSync(accessory.banner);
    }

    return response.status(200).json({ success: true, message: `O acessório "${accessory.name}" foi excluído com sucesso` });
  } catch (error) {
    console.log(error);
    return response.status(500).json({ success: false, message: error.message });
  }
};

const deleteAccessoryImage = async (request, response) => {
  try {
    const { id } = request.params;

    const accessory = await Accessory.findById(id);
    if (!accessory) {
      return response.status(404).json({ success: false, message: "Acessório não encontrado" });
    }

    if (!accessory.banner) {
      return response.status(404).json({ success: false, message: "Este acessório não possui banner" });
    }

    if (fs.existsSync(accessory.banner)) {
      fs.unlinkSync(accessory.banner);
    }

    await Accessory.findByIdAndUpdate(id, { banner: null });

    return response.status(200).json({ success: true, message: "Banner do acessório removido com sucesso" });
  } catch (error) {
    console.log(error);
    return response.status(500).json({ success: false, message: error.message });
  }
};

const editAccessory = async (request, response) => {
  try {
    const { id } = request.params;
    const accessory = request.body;

    const updateData = {
      ...accessory,
      updatedBy: request.user._id,
      updatedByName: request.user.name,
    };

    if (accessory.itens !== undefined) {
      updateData.itens = parseJsonField(accessory.itens);
    }

    if (request.files?.banner?.[0]) {
      const existing = await Accessory.findById(id);
      if (existing?.banner && fs.existsSync(existing.banner)) {
        fs.unlinkSync(existing.banner);
      }
      updateData.banner = request.files.banner[0].path;
    }

    const updatedAccessory = await Accessory.findByIdAndUpdate(id, updateData, { new: true, runValidators: true }).populate("itens.item installationService");

    if (!updatedAccessory) {
      return response.status(404).json({ success: false, message: "Acessório não encontrado" });
    }

    return response.status(200).json({ success: true, message: "Acessório editado", result: updatedAccessory });
  } catch (error) {
    cleanupFiles(request.files);
    console.log(error);
    return response.status(500).json({ success: false, message: error.message });
  }
};

export { createAccessory, findAllAccessories, findAccessoryById, deleteAccessory, editAccessory, deleteAccessoryImage };
