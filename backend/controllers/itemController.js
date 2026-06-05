import Item from "../models/itemModel.js";
import mongoose from "mongoose";

const createItem = async (request, response) => {
  try {
    const newItem = {
      name: request.body.name,
      code: request.body.code,
      desc: request.body.desc,
      price: request.body.price,
      createdBy: request.user._id,
      createdByName: request.user.name,
      updatedBy: request.user._id,
      updatedByName: request.user.name,
    };

    const item = await Item.create(newItem);

    return response.status(201).json({ success: true, message: "Item criado com sucesso", result: item });
  } catch (error) {
    console.log(error);
    return response.status(500).json({ success: false, message: error.message });
  }
};

const findAllItems = async (request, response) => {
  try {
    const allItems = await Item.find({});
    return response.status(200).json({ success: true, message: "Todos os itens foram encontrados com sucesso", result: allItems });
  } catch (error) {
    console.log(error);
    return response.status(500).json({ success: false, message: error.message });
  }
};

const findItemById = async (request, response) => {
  try {
    const { id } = request.params;

    const item = await Item.findById(id);

    if (!item) {
      return response.status(404).json({ success: false, message: "Nenhum item encontrado" });
    }

    return response.status(200).json({ success: true, message: "Item encontrado com sucesso", result: item });
  } catch (error) {
    console.log(error);
    return response.status(500).json({ success: false, message: error.message });
  }
};

const deleteItem = async (request, response) => {
  try {
    const { id } = request.params;
    const item = await Item.findByIdAndDelete(id);

    if (!item) {
      return response.status(404).json({ success: false, message: "Item não encontrado" });
    }

    return response.status(200).json({ success: true, message: `O item "${item.name}" foi excluído com sucesso` });
  } catch (error) {
    console.log(error);
    return response.status(500).json({ success: false, message: error.message });
  }
};

const editItem = async (request, response) => {
  try {
    const { id } = request.params;
    const item = request.body;

    const updateData = {
      ...item,
      updatedBy: request.user._id,
      updatedByName: request.user.name,
    };

    const updatedItem = await Item.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });

    if (!updatedItem) {
      return response.status(404).json({ success: false, message: "Item não encontrado" });
    }

    return response.status(200).json({ success: true, message: "Item editado", result: updatedItem });
  } catch (error) {
    console.log(error);
    return response.status(500).json({ success: false, message: error.message });
  }
};

export { createItem, findAllItems, findItemById, deleteItem, editItem };
