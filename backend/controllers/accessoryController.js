import Accessory from "../models/accessoryModel.js";
import { deleteImage } from "../services/openinaryService.js";

const createAccessory = async (request, response) => {
  try {
    const newAccessory = {
      name: request.body.name,
      code: request.body.code,
      desc: request.body.desc,
      banner: request.body.banner,
      observation: request.body.observation,
      itens: request.body.itens,
      installationCost: request.body.installationCost,
      createdBy: request.user._id,
      updatedBy: request.user._id,
    };

    const accessory = await Accessory.create(newAccessory);

    await accessory.populate("itens.item");

    return response.status(201).json({ success: true, message: "Acessório criado com sucesso", result: accessory });
  } catch (error) {
    console.log(error);
    return response.status(500).json({ success: false, message: error.message });
  }
};

const findAllAccessories = async (request, response) => {
  try {
    const canSeePrice = request.user.admin === true || request.user.manager === true;
    
    const allAccessories = (await Accessory.find({}).populate("itens.item", canSeePrice ? "" : "-price")).map(accessory => accessory.toObject({ virtuals: canSeePrice }));

    if (!canSeePrice) {
      allAccessories.forEach((item) => {
        item.installationCost = undefined;
      });
    }

    return response.status(200).json({ success: true, message: "Todos os acessórios foram encontrados com sucesso", result: allAccessories });
  } catch (error) {
    console.log(error);
    return response.status(500).json({ success: false, message: error.message });
  }
};

const findAccessoryById = async (request, response) => {
  try {
    const { id } = request.params;

    const canSeePrice = request.user.admin === true || request.user.manager === true;

    const accessory = await Accessory.findById(id)
      .populate("itens.item", canSeePrice ? "" : "-price")
      .populate("createdBy", "name email")
      .populate("updatedBy", "name email");

    if (!accessory) {
      return response.status(404).json({ success: false, message: "Nenhum acessório encontrado" });
    }

    if (!canSeePrice) {
      accessory.installationCost = undefined;
    }

    return response.status(200).json({ success: true, message: "Acessório encontrado com sucesso", result: accessory.toObject({ virtuals: canSeePrice }) });
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

    if (accessory.banner) await deleteImage(accessory.banner);

    return response.status(200).json({ success: true, message: `O acessório "${accessory.name}" foi excluído com sucesso` });
  } catch (error) {
    console.log(error);
    return response.status(500).json({ success: false, message: error.message });
  }
};

const editAccessory = async (request, response) => {
  try {
    const { id } = request.params;

    const currentAccessory = await Accessory.findById(id);
    if (!currentAccessory) {
      return response.status(404).json({ success: false, message: "Acessório não encontrado" });
    }

    if ("banner" in request.body && request.body.banner !== currentAccessory.banner) {
      if (currentAccessory.banner) await deleteImage(currentAccessory.banner);
    }

    const updateData = {
      ...request.body,
      updatedBy: request.user._id,
    };

    const updatedAccessory = await Accessory.findByIdAndUpdate(id, updateData, { returnDocument: "after", runValidators: true });

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
