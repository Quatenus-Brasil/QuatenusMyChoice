import Accessory from "../models/accessoryModel.js";
import mongoose from "mongoose";

const createAccessory = async (request, response) => {
  try {
    const newAccessory = {
      name: request.body.name,
      code: request.body.code,
      desc: request.body.desc,
      basePrice: request.body.basePrice,
      itens: request.body.itens,
      installationService: request.body.installationService,
      createdBy: request.user._id,
      createdByName: request.user.name,
      updatedBy: request.user._id,
      updatedByName: request.user.name,
    };

    const accessory = await Accessory.create(newAccessory);

    await accessory.populate("itens.item installationService");

    return response.status(201).json({ success: true, message: "Acessório criado com sucesso", result: accessory });
  } catch (error) {
    console.log(error);
    return response.status(500).json({ success: false, message: error.message });
  }
};

const findAllAccessories = async (request, response) => {
  try {
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

    return response.status(200).json({ success: true, message: `O acessório "${accessory.name}" foi excluído com sucesso` });
  } catch (error) {
    console.log(error);
    return response.status(500).json({ success: false, message: error.message });
  }
};

const editAccessory = async (request, response) => {
  try {
    const { id } = request.params;
    const accessory = request.body;

    const updatedAccessory = await Accessory.findByIdAndUpdate(
      id,
      { ...accessory, updatedBy: request.user._id, updatedByName: request.user.name },
      { new: true, runValidators: true }
    ).populate("itens.item installationService");

    if (!updatedAccessory) {
      return response.status(404).json({ success: false, message: "Acessório não encontrado" });
    }

    return response.status(200).json({ success: true, message: "Acessório editado", result: updatedAccessory });
  } catch (error) {
    console.log(error);
    return response.status(500).json({ success: false, message: error.message });
  }
};

export { createAccessory, findAllAccessories, findAccessoryById, deleteAccessory, editAccessory };
