import Chip from "../models/chipModel.js";
import mongoose from "mongoose";

const createChip = async (request, response) => {
  try {
    const newChip = {
      name: request.body.name,
      code: request.body.code,
      desc: request.body.desc,
      basePrice: request.body.basePrice,
      itens: request.body.itens,
      createdBy: request.user._id,
      createdByName: request.user.name,
      updatedBy: request.user._id,
      updatedByName: request.user.name,
    };

    const chip = await Chip.create(newChip);

    await chip.populate("itens.item");

    return response.status(201).json({ success: true, message: "Chip criado com sucesso", result: chip });
  } catch (error) {
    console.log(error);
    return response.status(500).json({ success: false, message: error.message });
  }
};

const findAllChips = async (request, response) => {
  try {
    const allChips = await Chip.find({}).populate("itens.item");
    return response.status(200).json({ success: true, message: "Todos os chips foram encontrados com sucesso", result: allChips });
  } catch (error) {
    console.log(error);
    return response.status(500).json({ success: false, message: error.message });
  }
};

const findChipById = async (request, response) => {
  try {
    const { id } = request.params;

    const chip = await Chip.findById(id).populate("itens.item");
    if (!chip) {
      return response.status(404).json({ success: false, message: "Nenhum chip encontrado" });
    }

    return response.status(200).json({ success: true, message: "Chip encontrado com sucesso", result: chip });
  } catch (error) {
    console.log(error);
    return response.status(500).json({ success: false, message: error.message });
  }
};

const deleteChip = async (request, response) => {
  try {
    const { id } = request.params;
    const chip = await Chip.findByIdAndDelete(id);

    if (!chip) {
      return response.status(404).json({ success: false, message: "Chip não encontrado" });
    }

    return response.status(200).json({ success: true, message: `O chip "${chip.name}" foi excluído com sucesso` });
  } catch (error) {
    console.log(error);
    return response.status(500).json({ success: false, message: error.message });
  }
};

const editChip = async (request, response) => {
  try {
    const { id } = request.params;
    const chip = request.body;

    const updatedChip = await Chip.findByIdAndUpdate(
      id,
      { ...chip, updatedBy: request.user._id, updatedByName: request.user.name },
      { new: true, runValidators: true }
    ).populate("itens.item");

    if (!updatedChip) {
      return response.status(404).json({ success: false, message: "Chip não encontrado" });
    }

    return response.status(200).json({ success: true, message: "Chip editado", result: updatedChip });
  } catch (error) {
    console.log(error);
    return response.status(500).json({ success: false, message: error.message });
  }
};

export { createChip, findAllChips, findChipById, deleteChip, editChip };
