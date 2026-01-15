import Accessory from "../models/accessoryModel.js";
import { convertCurrencyToInt, convertIntToCurrency } from "../services/currencyService.js"; 
import mongoose from "mongoose";

const createAccessory = async (request, response) => {
  try {
    const newAccessory = {
      name: request.body.name,
      code: request.body.code,
      numericCode: request.body.numericCode,
      desc: request.body.desc,
      basePrice: convertCurrencyToInt(request.body.basePrice),
      itens: request.body.itens,
      installationService: request.body.installationService,
      riskFactor: request.body.riskFactor,
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
    const allAccessoriesWithConvertedPrice = allAccessories.map(accessory => {
      const accessoryObj = accessory.toObject();
      return {
        ...accessoryObj,
        basePrice: convertIntToCurrency(accessory.basePrice),
        itens: accessoryObj.itens.map(item => ({
          ...item,
          item: item.item ? {
            ...item.item,
            price: convertIntToCurrency(item.item.price)
          } : null
        })),
        installationService: accessoryObj.installationService ? {
          ...accessoryObj.installationService,
          price: convertIntToCurrency(accessoryObj.installationService.price)
        } : null
      };
    });
    return response.status(200).json({ success: true, message: "Todos os acessórios foram encontrados com sucesso", result: allAccessoriesWithConvertedPrice });
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

    const accessoryObj = accessory.toObject();
    const accessoryWithConvertedPrice = {
      ...accessoryObj,
      basePrice: convertIntToCurrency(accessory.basePrice),
      itens: accessoryObj.itens.map(item => ({
        ...item,
        item: item.item ? {
          ...item.item,
          price: convertIntToCurrency(item.item.price)
        } : null
      })),
      installationService: accessoryObj.installationService ? {
        ...accessoryObj.installationService,
        price: convertIntToCurrency(accessoryObj.installationService.price)
      } : null
    };

    return response.status(200).json({ success: true, message: "Acessório encontrado com sucesso", result: accessoryWithConvertedPrice });
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

    const updateData = {
      ...accessory,
      updatedBy: request.user._id,
      updatedByName: request.user.name
    };

    // Só converte o basePrice se ele estiver presente no body
    if (accessory.basePrice !== undefined) {
      updateData.basePrice = convertCurrencyToInt(accessory.basePrice);
    }

    const updatedAccessory = await Accessory.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate("itens.item installationService");

    if (!updatedAccessory) {
      return response.status(404).json({ success: false, message: "Acessório não encontrado" });
    }

    const accessoryObj = updatedAccessory.toObject();
    const accessoryWithConvertedPrice = {
      ...accessoryObj,
      basePrice: convertIntToCurrency(updatedAccessory.basePrice),
      itens: accessoryObj.itens.map(item => ({
        ...item,
        item: item.item ? {
          ...item.item,
          price: convertIntToCurrency(item.item.price)
        } : null
      })),
      installationService: accessoryObj.installationService ? {
        ...accessoryObj.installationService,
        price: convertIntToCurrency(accessoryObj.installationService.price)
      } : null
    };

    return response.status(200).json({ success: true, message: "Acessório editado", result: accessoryWithConvertedPrice });
  } catch (error) {
    console.log(error);
    return response.status(500).json({ success: false, message: error.message });
  }
};

export { createAccessory, findAllAccessories, findAccessoryById, deleteAccessory, editAccessory };
