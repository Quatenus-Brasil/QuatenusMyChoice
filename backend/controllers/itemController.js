import Item from "../models/itemModel.js";

const createItem = async (request, response) => {
  try {
    const newItem = {
      name: request.body.name,
      code: request.body.code,
      desc: request.body.desc,
      price: request.body.price,
      createdBy: request.user._id,
      updatedBy: request.user._id,
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

    const canSeePrice = request.user.admin === true || request.user.manager === true;

    if (!canSeePrice) {
      allItems.forEach((item) => {
        item.price = undefined;
      });
    }

    return response.status(200).json({ success: true, message: "Todos os itens foram encontrados com sucesso", result: allItems });
  } catch (error) {
    console.log(error);
    return response.status(500).json({ success: false, message: error.message });
  }
};

const findItemById = async (request, response) => {
  try {
    const { id } = request.params;

    const item = await Item.findById(id).populate("createdBy", "name email").populate("updatedBy", "name email");

    if (!item) {
      return response.status(404).json({ success: false, message: "Nenhum item encontrado" });
    }

    const canSeePrice = request.user.admin === true || request.user.manager === true;

    if (!canSeePrice) {
      item.price = undefined;
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

    const updateData = {
      ...request.body,
      updatedBy: request.user._id,
    };

    const updatedItem = await Item.findByIdAndUpdate(id, updateData, { returnDocument: "after", runValidators: true });

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
