import AccessoryInstallationCategory from "../models/accessoryInstallationCategoryModel.js";
import mongoose from "mongoose";

const createAccessoryInstallationCategory = async (request, response) => {
  try {
    const newAccessoryInstallationCategory = {
      name: request.body.name,
      code: request.body.code,
      price: request.body.price,
      createdBy: request.user._id,
      updatedBy: request.user._id,
    };

    const accessoryInstallationCategory = await AccessoryInstallationCategory.create(newAccessoryInstallationCategory);

    return response.status(201).json({ success: true, message: "Categoria de instalação de acessório criada com sucesso", result: accessoryInstallationCategory });
  } catch (error) {
    console.log(error);
    return response.status(500).json({ success: false, message: error.message });
  }
};

const findAllAccessoryInstallationCategories = async (request, response) => {
  try {
    const allAccessoryInstallationCategories = await AccessoryInstallationCategory.find({});

    return response.status(200).json({ success: true, message: "Todas as categorias de instalação de acessório foram encontradas com sucesso", result: allAccessoryInstallationCategories });
  } catch (error) {
    console.log(error);
    return response.status(500).json({ success: false, message: error.message });
  }
};

const findAccessoryInstallationCategoryById = async (request, response) => {
  try {
    const { id } = request.params;

    const accessoryInstallationCategory = await AccessoryInstallationCategory.findById(id).populate("createdBy", "name email").populate("updatedBy", "name email");

    if (!accessoryInstallationCategory) {
      return response.status(404).json({ success: false, message: "Nenhuma categoria de instalação de acessório encontrada" });
    }

    return response.status(200).json({ success: true, message: "Categoria de instalação de acessório encontrada com sucesso", result: accessoryInstallationCategory });
  } catch (error) {
    console.log(error);
    return response.status(500).json({ success: false, message: error.message });
  }
};

const deleteAccessoryInstallationCategory = async (request, response) => {
  try {
    const { id } = request.params;
    const accessoryInstallationCategory = await AccessoryInstallationCategory.findByIdAndDelete(id);

    if (!accessoryInstallationCategory) {
      return response.status(404).json({ success: false, message: "Categoria de instalação de acessório não encontrada" });
    }

    return response.status(200).json({ success: true, message: `A categoria de instalação de acessório "${accessoryInstallationCategory.name}" foi excluída com sucesso` });
  } catch (error) {
    console.log(error);
    return response.status(500).json({ success: false, message: error.message });
  }
};

const editAccessoryInstallationCategory = async (request, response) => {
  try {
    const { id } = request.params;
    const accessoryInstallationCategory = request.body;

    const updateData = {
      ...accessoryInstallationCategory,
      updatedBy: request.user._id,
    };

    const updatedAccessoryInstallationCategory = await AccessoryInstallationCategory.findByIdAndUpdate(id, updateData, { returnDocument: "after", runValidators: true });

    if (!updatedAccessoryInstallationCategory) {
      return response.status(404).json({ success: false, message: "Categoria de instalação de acessório não encontrada" });
    }

    return response.status(200).json({ success: true, message: "Categoria de instalação de acessório editada", result: updatedAccessoryInstallationCategory });
  } catch (error) {
    console.log(error);
    return response.status(500).json({ success: false, message: error.message });
  }
};

export { createAccessoryInstallationCategory, findAllAccessoryInstallationCategories, findAccessoryInstallationCategoryById, deleteAccessoryInstallationCategory, editAccessoryInstallationCategory };
