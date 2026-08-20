import FamilyBom from "../models/familyBom.js";
import mongoose from "mongoose";
import { deleteImage } from "../services/openinaryService.js";

const createFamilyBom = async (request, response) => {
  try {
    const newFamilyBom = {
      name: request.body.name,
      code: request.body.code,
      desc: request.body.desc,
      observation: request.body.observation,
      itens: request.body.itens,
      accessories: request.body.accessories,
      device: request.body.device,
      activationGuide: request.body.activationGuide,
      altDevice: request.body.altDevice,
      altActivationGuide: request.body.altActivationGuide,
      chip: request.body.chip,
      riskFactor: request.body.riskFactor,
      commitment12Months: request.body.commitment12Months,
      commitment24Months: request.body.commitment24Months,
      commitment36Months: request.body.commitment36Months,
      commitment48Months: request.body.commitment48Months,
      commitment60Months: request.body.commitment60Months,
      installationCost: request.body.installationCost,
      createdBy: request.user._id,
      updatedBy: request.user._id,
    };

    const familyBom = await FamilyBom.create(newFamilyBom);

    await familyBom.populate("itens.item accessories.accessory device altDevice chip");

    return response.status(201).json({ success: true, message: "B.O.M da Família criado com sucesso", result: familyBom });
  } catch (error) {
    console.log(error);
    return response.status(500).json({ success: false, message: error.message });
  }
};

const findAllFamiliesBom = async (request, response) => {
  try {
    const allFamiliesBom = await FamilyBom.find({});

    const canSeePrice = request.user.admin === true || request.user.manager === true;

    if (!canSeePrice) {
      allFamiliesBom.forEach((item) => {
        item.riskFactor = undefined;
        item.commitment12Months = undefined;
        item.commitment24Months = undefined;
        item.commitment36Months = undefined;
        item.commitment48Months = undefined;
        item.commitment60Months = undefined;
        item.installationCost = undefined;
      });
    }

    return response.status(200).json({ success: true, message: "Todos os B.O.Ms da Família foram encontrados com sucesso", result: allFamiliesBom });
  } catch (error) {
    console.log(error);
    return response.status(500).json({ success: false, message: error.message });
  }
};

const findFamilyBomById = async (request, response) => {
  try {
    const { id } = request.params;

    const canSeePrice = request.user.admin === true || request.user.manager === true;

    const familyBom = await FamilyBom.findById(id)
      .populate("itens.item", canSeePrice ? "" : "-price")
      .populate({
        path: "accessories.accessory",
        populate: {
          path: "itens.item",
          select: canSeePrice ? "" : "-price",
        },
      })
      .populate({
        path: "device",
        populate: {
          path: "itens.item",
          select: canSeePrice ? "" : "-price",
        },
      })
      .populate({
        path: "altDevice",
        populate: {
          path: "itens.item",
          select: canSeePrice ? "" : "-price",
        },
      })
      .populate("chip", canSeePrice ? "" : "-price");

    if (!familyBom) {
      return response.status(404).json({ success: false, message: "Nenhum B.O.M da Família encontrado" });
    }

    if (!canSeePrice) {
      familyBom.riskFactor = undefined;
      familyBom.commitment12Months = undefined;
      familyBom.commitment24Months = undefined;
      familyBom.commitment36Months = undefined;
      familyBom.commitment48Months = undefined;
      familyBom.commitment60Months = undefined;
      familyBom.installationCost = undefined;
      familyBom.accessories.forEach((accessoryEntry) => {
        accessoryEntry.accessory.installationCost = undefined;
      });
    }

    return response
      .status(200)
      .json({ success: true, message: "B.O.M da Família encontrado com sucesso", result: familyBom.toObject({ virtuals: canSeePrice }) });
  } catch (error) {
    console.log(error);
    return response.status(500).json({ success: false, message: error.message });
  }
};

const deleteFamilyBom = async (request, response) => {
  try {
    const { id } = request.params;
    const familyBom = await FamilyBom.findByIdAndDelete(id);

    if (!familyBom) {
      return response.status(404).json({ success: false, message: "B.O.M da Família não encontrado" });
    }

    return response.status(200).json({ success: true, message: `O B.O.M da Família "${familyBom.name}" foi excluído com sucesso` });
  } catch (error) {
    console.log(error);
    return response.status(500).json({ success: false, message: error.message });
  }
};

const editFamilyBom = async (request, response) => {
  try {
    const { id } = request.params;

    const currentFamilyBom = await FamilyBom.findById(id);
    if (!currentFamilyBom) {
      return response.status(404).json({ success: false, message: "B.O.M da Família não encontrado" });
    }
    
    const updateData = {
      ...request.body,
      updatedBy: request.user._id,
    };

    const updatedFamilyBom = await FamilyBom.findByIdAndUpdate(id, updateData, { returnDocument: "after", runValidators: true });

    if (!updatedFamilyBom) {
      return response.status(404).json({ success: false, message: "B.O.M da Família não encontrado" });
    }

    return response.status(200).json({ success: true, message: "B.O.M da Família editado", result: updatedFamilyBom });
  } catch (error) {
    console.log(error);
    return response.status(500).json({ success: false, message: error.message });
  }
};

export { createFamilyBom, findAllFamiliesBom, findFamilyBomById, deleteFamilyBom, editFamilyBom };
