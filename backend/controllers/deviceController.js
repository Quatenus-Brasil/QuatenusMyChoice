import Device from "../models/deviceModel.js";
import mongoose from "mongoose";
import { convertCurrencyToInt, convertIntToCurrency } from "../services/currencyService.js";

const createDevice = async (request, response) => {
  try {
    const newDevice = {
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

    const device = await Device.create(newDevice);

    await device.populate("itens.item installationService");

    return response.status(201).json({ success: true, message: "Dispositivo criado com sucesso", result: device });
  } catch (error) {
    console.log(error);
    return response.status(500).json({ success: false, message: error.message });
  }
};

const findAllDevices = async (request, response) => {
  try {
    const allDevices = await Device.find({}).populate("itens.item installationService");
    const allDevicesWithConvertedPrice = allDevices.map(device => {
      const deviceObj = device.toObject();
      return {
        ...deviceObj,
        basePrice: convertIntToCurrency(device.basePrice),
        itens: deviceObj.itens.map(item => ({
          ...item,
          item: item.item ? {
            ...item.item,
            price: convertIntToCurrency(item.item.price)
          } : null
        })),
        installationService: deviceObj.installationService ? {
          ...deviceObj.installationService,
          price: convertIntToCurrency(deviceObj.installationService.price)
        } : null
      };
    });
    return response.status(200).json({ success: true, message: "Todos os dispositivos foram encontrados com sucesso", result: allDevicesWithConvertedPrice });
  } catch (error) {
    console.log(error);
    return response.status(500).json({ success: false, message: error.message });
  }
};

const findDeviceById = async (request, response) => {
  try {
    const { id } = request.params;

    const device = await Device.findById(id).populate("itens.item installationService");
    if (!device) {
      return response.status(404).json({ success: false, message: "Nenhum dispositivo encontrado" });
    }

    const deviceObj = device.toObject();
    const deviceWithConvertedPrice = {
      ...deviceObj,
      basePrice: convertIntToCurrency(device.basePrice),
      itens: deviceObj.itens.map(item => ({
        ...item,
        item: item.item ? {
          ...item.item,
          price: convertIntToCurrency(item.item.price)
        } : null
      })),
      installationService: deviceObj.installationService ? {
        ...deviceObj.installationService,
        price: convertIntToCurrency(deviceObj.installationService.price)
      } : null
    };

    return response.status(200).json({ success: true, message: "Dispositivo encontrado com sucesso", result: deviceWithConvertedPrice });
  } catch (error) {
    console.log(error);
    return response.status(500).json({ success: false, message: error.message });
  }
};

const deleteDevice = async (request, response) => {
  try {
    const { id } = request.params;
    const device = await Device.findByIdAndDelete(id);

    if (!device) {
      return response.status(404).json({ success: false, message: "Dispositivo não encontrado" });
    }

    return response.status(200).json({ success: true, message: `O dispositivo "${device.name}" foi excluído com sucesso` });
  } catch (error) {
    console.log(error);
    return response.status(500).json({ success: false, message: error.message });
  }
};

const editDevice = async (request, response) => {
  try {
    const { id } = request.params;
    const device = request.body;

    const updateData = {
      ...device,
      updatedBy: request.user._id,
      updatedByName: request.user.name
    };

    // Só converte o basePrice se ele estiver presente no body
    if (device.basePrice !== undefined) {
      updateData.basePrice = convertCurrencyToInt(device.basePrice);
    }

    const updatedDevice = await Device.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate("itens.item installationService");

    if (!updatedDevice) {
      return response.status(404).json({ success: false, message: "Dispositivo não encontrado" });
    }

    const deviceObj = updatedDevice.toObject();
    const deviceWithConvertedPrice = {
      ...deviceObj,
      basePrice: convertIntToCurrency(updatedDevice.basePrice),
      itens: deviceObj.itens.map(item => ({
        ...item,
        item: item.item ? {
          ...item.item,
          price: convertIntToCurrency(item.item.price)
        } : null
      })),
      installationService: deviceObj.installationService ? {
        ...deviceObj.installationService,
        price: convertIntToCurrency(deviceObj.installationService.price)
      } : null
    };

    return response.status(200).json({ success: true, message: "Dispositivo editado", result: deviceWithConvertedPrice });
  } catch (error) {
    console.log(error);
    return response.status(500).json({ success: false, message: error.message });
  }
};

export { createDevice, findAllDevices, findDeviceById, deleteDevice, editDevice };
