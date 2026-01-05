import Item from "../models/itemModel.js";
import mongoose from "mongoose";

// const createItem = async (request, response) => {
//     try {

//     } catch (error) {
//     console.log(error);
//     return response.status(500).json({ success: false, message: error.message });
//   }
// }

const findAllItems = async (request, response) => {
  try {
    const allItems = await Item.find({});
    return response.status(200).json({success: true, message: "Todos os itens foram encontrados com sucesso", result: allItems});
  } catch (error) {
    console.log(error);
    return response.status(500).json({success: false, message: error.message });
  }
};

// const findItemById = async (request, response) => {
//   try {
//     const { id } = request.params;

//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return response.status(404).json({ message: "Mongo ID inválido" });
//     }

//     const item = await Item.findById(id);

//     if (!item) {
//       return response.status(404).json({ message: "Nenhum item encontrado" });
//     }

//     return response.status(200).json(item);
//   } catch (error) {
//     console.log(error);
//     return response.status(500).json({ message: error.message });
//   }
// };

// const deleteItem = async (request, response) => {
//   try {
//     const { id } = request.params;
//     const item = await Item.findByIdAndDelete(id);

//     if (!item) {
//       return response.status(404).json({ message: "Item não encontrado" });
//     }
//     return response.status(200).json({ message: `O item ${item} foi excluído com sucesso` });
//   } catch (error) {
//     console.log(error);
//     return response.status(500).json({ message: error.message });
//   }
// };

export { findAllItems };