import ProductInstallationCategory from "../models/productInstallationCategoryModel.js";
import mongoose from "mongoose";

const createProductInstallationCategory = async (request, response) => {
  try {
    const newProductInstallationCategory = {
      name: request.body.name,
      code: request.body.code,
      price: request.body.price,
      createdBy: request.user._id,
      updatedBy: request.user._id,
    };

    const productInstallationCategory = await ProductInstallationCategory.create(newProductInstallationCategory);

    return response.status(201).json({ success: true, message: "Categoria de instalação de acessório criada com sucesso", result: productInstallationCategory });
  } catch (error) {
    console.log(error);
    return response.status(500).json({ success: false, message: error.message });
  }
};

const findAllProductInstallationCategories = async (request, response) => {
  try {
    const allProductInstallationCategories = await ProductInstallationCategory.find({});

    return response.status(200).json({ success: true, message: "Todas as categorias de instalação de acessório foram encontradas com sucesso", result: allProductInstallationCategories });
  } catch (error) {
    console.log(error);
    return response.status(500).json({ success: false, message: error.message });
  }
};

const findProductInstallationCategoryById = async (request, response) => {
  try {
    const { id } = request.params;

    const productInstallationCategory = await ProductInstallationCategory.findById(id).populate("createdBy", "name email").populate("updatedBy", "name email");

    if (!productInstallationCategory) {
      return response.status(404).json({ success: false, message: "Nenhuma categoria de instalação de acessório encontrada" });
    }

    return response.status(200).json({ success: true, message: "Categoria de instalação de acessório encontrada com sucesso", result: productInstallationCategory });
  } catch (error) {
    console.log(error);
    return response.status(500).json({ success: false, message: error.message });
  }
};

const deleteProductInstallationCategory = async (request, response) => {
  try {
    const { id } = request.params;
    const productInstallationCategory = await ProductInstallationCategory.findByIdAndDelete(id);

    if (!productInstallationCategory) {
      return response.status(404).json({ success: false, message: "Categoria de instalação de acessório não encontrada" });
    }

    return response.status(200).json({ success: true, message: `A categoria de instalação de acessório "${productInstallationCategory.name}" foi excluída com sucesso` });
  } catch (error) {
    console.log(error);
    return response.status(500).json({ success: false, message: error.message });
  }
};

const editProductInstallationCategory = async (request, response) => {
  try {
    const { id } = request.params;

    const updateData = {
      ...request.body,
      updatedBy: request.user._id,
    };

    const updatedProductInstallationCategory = await ProductInstallationCategory.findByIdAndUpdate(id, updateData, { returnDocument: "after", runValidators: true });

    if (!updatedProductInstallationCategory) {
      return response.status(404).json({ success: false, message: "Categoria de instalação de acessório não encontrada" });
    }

    return response.status(200).json({ success: true, message: "Categoria de instalação de acessório editada", result: updatedProductInstallationCategory });
  } catch (error) {
    console.log(error);
    return response.status(500).json({ success: false, message: error.message });
  }
};

export { createProductInstallationCategory, findAllProductInstallationCategories, findProductInstallationCategoryById, deleteProductInstallationCategory, editProductInstallationCategory };
