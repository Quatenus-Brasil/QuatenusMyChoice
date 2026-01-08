import Gama from "../models/gamaModel.js";
import mongoose from "mongoose";

const createGama = async (request, response) => {
  try {
    const newGama = {
      name: request.body.name,
      code: request.body.code,
      desc: request.body.desc,
      price: request.body.price,
      createdBy: request.user._id,
      createdByName: request.user.name,
      updatedBy: request.user._id,
      updatedByName: request.user.name,
    };

    const gama = await Gama.create(newGama);

    return response.status(201).json({ success: true, message: "Gama criado com sucesso", result: gama });
  } catch (error) {
    console.log(error);
    return response.status(500).json({ success: false, message: error.message });
  }
};

const findAllGamas = async (request, response) => {
  try {
    const allGamas = await Gama.find({});
    return response.status(200).json({ success: true, message: "Todas as gamas foram encontradas com sucesso", result: allGamas });
  } catch (error) {
    console.log(error);
    return response.status(500).json({ success: false, message: error.message });
  }
};

const findGamaById = async (request, response) => {
  try {
    const { id } = request.params;

    const gama = await Gama.findById(id);

    if (!gama) {
      return response.status(404).json({ success: false, message: "Nenhuma gama encontrada" });
    }

    return response.status(200).json({ success: true, message: "Gama encontrada com sucesso", result: gama });
  } catch (error) {
    console.log(error);
    return response.status(500).json({ success: false, message: error.message });
  }
};

const deleteGama = async (request, response) => {
  try {
    const { id } = request.params;
    const gama = await Gama.findByIdAndDelete(id);

    if (!gama) {
      return response.status(404).json({ success: false, message: "Gama não encontrada" });
    }

    return response.status(200).json({ success: true, message: `A gama "${gama.name}" foi excluída com sucesso` });
  } catch (error) {
    console.log(error);
    return response.status(500).json({ success: false, message: error.message });
  }
};

const editGama = async (request, response) => {
  try {
    const { id } = request.params;
    const gama = request.body;

    const updatedGama = await Gama.findByIdAndUpdate(
      id,
      { ...gama, updatedBy: request.user._id, updatedByName: request.user.name },
      { new: true, runValidators: true }
    );

    if (!updatedGama) {
      return response.status(404).json({ success: false, message: "Gama não encontrada" });
    }

    return response.status(200).json({ success: true, message: "Gama editada", result: updatedGama });
  } catch (error) {
    console.log(error);
    return response.status(500).json({ success: false, message: error.message });
  }
};

export { createGama, findAllGamas, findGamaById, deleteGama, editGama };
